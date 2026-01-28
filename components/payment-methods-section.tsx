"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Smartphone, CreditCard, FileText, Clock, Loader2, CheckCircle, AlertCircle, Download, ArrowLeft, Phone } from "lucide-react"

type PaymentStatus = "idle" | "form" | "processing" | "waiting" | "success" | "error"

const paymentMethods = [
  { icon: Building2, title: "Bank Transfer", description: "International & local banking", type: "bank" },
  { icon: Smartphone, title: "Mobile Money", description: "M-Pesa & regional services", type: "mpesa" },
  { icon: CreditCard, title: "Card Payments", description: "Visa, Mastercard accepted", type: "stripe" },
  { icon: FileText, title: "Institutional Invoicing", description: "DFI & corporate billing", type: "invoice" },
]

const amountPresets = [
  { label: "KES 1,000", value: 1000 },
  { label: "KES 5,000", value: 5000 },
  { label: "KES 10,000", value: 10000 },
  { label: "KES 50,000", value: 50000 },
]

const usdPresets = [
  { label: "$50", value: 50 },
  { label: "$100", value: 100 },
  { label: "$500", value: 500 },
  { label: "$1,000", value: 1000 },
]

export function PaymentMethodsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [transactionId, setTransactionId] = useState("")

  // Form fields
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const resetForm = () => {
    setPhone("")
    setAmount("")
    setEmail("")
    setName("")
    setPaymentStatus("form")
    setErrorMessage("")
    setTransactionId("")
  }

  const handleCardClick = (methodTitle: string, methodType: string) => {
    setSelectedMethod(methodTitle)
    setSelectedType(methodType)
    setIsModalOpen(true)
    resetForm()
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setPaymentStatus("idle")
  }

  const validatePhone = (phoneNumber: string): boolean => {
    const cleaned = phoneNumber.replace(/\s/g, "").replace(/^0/, "").replace(/^\+254/, "")
    return /^[17]\d{8}$/.test(cleaned)
  }

  const handleMpesaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePhone(phone)) {
      setErrorMessage("Enter a valid Kenyan phone number (07XX or 01XX)")
      return
    }
    if (!amount || parseFloat(amount) < 1 || parseFloat(amount) > 150000) {
      setErrorMessage("Amount must be between KES 1 and 150,000")
      return
    }

    setPaymentStatus("processing")
    setErrorMessage("")

    try {
      const response = await fetch("/api/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone,
          amount: parseFloat(amount),
          accountReference: "OxicGroup",
          transactionDesc: "Investment Payment",
        }),
      })
      const data = await response.json()
      if (data.success) {
        setTransactionId(data.checkoutRequestId || "TXN" + Date.now())
        setPaymentStatus("waiting")
      } else {
        setErrorMessage(data.error || "Failed to initiate payment")
        setPaymentStatus("error")
      }
    } catch {
      setErrorMessage("Network error. Please check your connection.")
      setPaymentStatus("error")
    }
  }

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Enter a valid email address")
      return
    }
    if (!amount || parseFloat(amount) < 1) {
      setErrorMessage("Enter a valid amount")
      return
    }

    setPaymentStatus("processing")
    setErrorMessage("")

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: "usd",
          description: "Investment Advisory Services",
          customerEmail: email,
          customerName: name,
        }),
      })
      const data = await response.json()
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        setErrorMessage(data.error || "Failed to create checkout session")
        setPaymentStatus("error")
      }
    } catch {
      setErrorMessage("Network error. Please check your connection.")
      setPaymentStatus("error")
    }
  }

  const renderMpesaContent = () => {
    if (paymentStatus === "waiting") {
      return (
        <div className="text-center py-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 animate-pulse">
            <Phone className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Check Your Phone</h3>
          <p className="text-muted-foreground mb-4">An STK push has been sent to <span className="font-medium text-foreground">{phone}</span></p>
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <p className="text-sm">Enter your M-Pesa PIN to complete payment of</p>
            <p className="text-2xl font-bold text-green-600">KES {parseFloat(amount).toLocaleString()}</p>
          </div>
          <p className="text-xs text-muted-foreground">Transaction ID: {transactionId}</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={resetForm}>
              <ArrowLeft className="h-4 w-4 mr-2" />Try Again
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setPaymentStatus("success")}>
              I've Paid
            </Button>
          </div>
        </div>
      )
    }

    if (paymentStatus === "success") {
      return (
        <div className="text-center py-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Payment Submitted</h3>
          <p className="text-muted-foreground mb-4">Your payment is being processed. You will receive a confirmation SMS.</p>
          <div className="bg-muted/50 rounded-lg p-4 mb-4 text-left">
            <div className="flex justify-between py-1"><span className="text-muted-foreground">Amount:</span><span className="font-medium">KES {parseFloat(amount).toLocaleString()}</span></div>
            <div className="flex justify-between py-1"><span className="text-muted-foreground">Phone:</span><span className="font-medium">{phone}</span></div>
            <div className="flex justify-between py-1"><span className="text-muted-foreground">Reference:</span><span className="font-medium">{transactionId}</span></div>
          </div>
          <Button variant="outline" className="w-full bg-transparent" onClick={handleClose}>
            <Download className="h-4 w-4 mr-2" />Download Receipt
          </Button>
        </div>
      )
    }

    return (
      <form onSubmit={handleMpesaSubmit} className="space-y-4">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <Smartphone className="h-7 w-7 text-green-600" />
          </div>
          <DialogTitle className="text-center">M-Pesa Payment</DialogTitle>
          <DialogDescription className="text-center">Enter your details to receive an STK push</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="mpesa-phone">Phone Number</Label>
          <Input id="mpesa-phone" type="tel" placeholder="0712345678" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ""))} required maxLength={13} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mpesa-amount">Amount (KES)</Label>
          <Input id="mpesa-amount" type="number" placeholder="1000" min="1" max="150000" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <div className="flex gap-2 mt-2">
            {amountPresets.map((preset) => (
              <Button key={preset.value} type="button" variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => setAmount(preset.value.toString())}>{preset.label}</Button>
            ))}
          </div>
        </div>
        {errorMessage && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="h-4 w-4" />{errorMessage}</div>}
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={paymentStatus === "processing"}>
          {paymentStatus === "processing" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending STK Push...</> : "Pay with M-Pesa"}
        </Button>
      </form>
    )
  }

  const renderStripeContent = () => {
    if (paymentStatus === "error") {
      return (
        <div className="text-center py-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
          <Button variant="outline" onClick={resetForm}><ArrowLeft className="h-4 w-4 mr-2" />Try Again</Button>
        </div>
      )
    }

    return (
      <form onSubmit={handleStripeSubmit} className="space-y-4">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
            <CreditCard className="h-7 w-7 text-blue-600" />
          </div>
          <DialogTitle className="text-center">Card Payment</DialogTitle>
          <DialogDescription className="text-center">Secure payment powered by Stripe</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="stripe-name">Full Name</Label>
          <Input id="stripe-name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stripe-email">Email Address</Label>
          <Input id="stripe-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stripe-amount">Amount (USD)</Label>
          <Input id="stripe-amount" type="number" placeholder="100" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <div className="flex gap-2 mt-2">
            {usdPresets.map((preset) => (
              <Button key={preset.value} type="button" variant="outline" size="sm" className="flex-1 text-xs bg-transparent" onClick={() => setAmount(preset.value.toString())}>{preset.label}</Button>
            ))}
          </div>
        </div>
        {errorMessage && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="h-4 w-4" />{errorMessage}</div>}
        <Button type="submit" className="w-full bg-[#635bff] hover:bg-[#5851db]" disabled={paymentStatus === "processing"}>
          {paymentStatus === "processing" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Redirecting...</> : "Pay with Card"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">You will be redirected to Stripe's secure checkout</p>
      </form>
    )
  }

  const renderModalContent = () => {
    if (selectedType === "mpesa") return renderMpesaContent()
    if (selectedType === "stripe") return renderStripeContent()
    return (
      <>
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/20">
            <Clock className="h-7 w-7 text-secondary" />
          </div>
          <DialogTitle className="text-center">Coming Soon</DialogTitle>
          <DialogDescription className="text-center"><span className="font-semibold text-primary">{selectedMethod}</span> is under development.</DialogDescription>
        </DialogHeader>
        <p className="text-center text-sm text-muted-foreground mt-4">Contact us via WhatsApp for immediate payment assistance.</p>
      </>
    )
  }

  return (
    <section className="bg-muted/30 py-12 sm:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">Flexible Payment Options</h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">Secure payment methods for seamless transactions</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-4 grid-cols-2 md:grid-cols-4">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <Card key={index} className="border-border text-center transition-all hover:shadow-md hover:border-secondary/50 cursor-pointer group" onClick={() => handleCardClick(method.title, method.type)}>
                <CardHeader className="pb-2 px-3 pt-4">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-secondary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <CardTitle className="text-sm">{method.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-4">
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">{renderModalContent()}</DialogContent>
      </Dialog>
    </section>
  )
}
