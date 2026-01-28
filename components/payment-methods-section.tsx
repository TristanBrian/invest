"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Smartphone, CreditCard, FileText, Clock, Loader2, CheckCircle, AlertCircle } from "lucide-react"

const paymentMethods = [
  {
    icon: Building2,
    title: "Bank Transfer",
    description: "International & local banking",
    type: "bank",
  },
  {
    icon: Smartphone,
    title: "Mobile Money",
    description: "M-Pesa & regional services",
    type: "mpesa",
  },
  {
    icon: CreditCard,
    title: "Card Payments",
    description: "Visa, Mastercard accepted",
    type: "stripe",
  },
  {
    icon: FileText,
    title: "Institutional Invoicing",
    description: "DFI & corporate billing",
    type: "invoice",
  },
]

export function PaymentMethodsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  
  // M-Pesa state
  const [mpesaPhone, setMpesaPhone] = useState("")
  const [mpesaAmount, setMpesaAmount] = useState("")
  const [mpesaLoading, setMpesaLoading] = useState(false)
  const [mpesaStatus, setMpesaStatus] = useState<"idle" | "success" | "error">("idle")
  const [mpesaMessage, setMpesaMessage] = useState("")

  // Stripe state
  const [stripeAmount, setStripeAmount] = useState("")
  const [stripeEmail, setStripeEmail] = useState("")
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeError, setStripeError] = useState("")

  const handleCardClick = (methodTitle: string, methodType: string) => {
    setSelectedMethod(methodTitle)
    setSelectedType(methodType)
    setIsModalOpen(true)
    // Reset states
    setMpesaStatus("idle")
    setMpesaMessage("")
    setStripeError("")
  }

  const handleMpesaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMpesaLoading(true)
    setMpesaStatus("idle")
    setMpesaMessage("")

    try {
      const response = await fetch("/api/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: mpesaPhone,
          amount: parseFloat(mpesaAmount),
          accountReference: "OxicGroup",
          transactionDesc: "Investment Payment",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMpesaStatus("success")
        setMpesaMessage(data.message)
      } else {
        setMpesaStatus("error")
        setMpesaMessage(data.error || "Failed to initiate payment")
      }
    } catch (error) {
      setMpesaStatus("error")
      setMpesaMessage("Network error. Please try again.")
    } finally {
      setMpesaLoading(false)
    }
  }

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStripeLoading(true)
    setStripeError("")

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(stripeAmount),
          currency: "usd",
          description: "Investment Advisory Services",
          customerEmail: stripeEmail,
        }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        setStripeError(data.error || "Failed to create checkout session")
      }
    } catch (error) {
      setStripeError("Network error. Please try again.")
    } finally {
      setStripeLoading(false)
    }
  }

  const renderModalContent = () => {
    if (selectedType === "mpesa") {
      return (
        <div className="space-y-4">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Smartphone className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">M-Pesa Payment</DialogTitle>
            <DialogDescription className="text-center">
              Enter your phone number and amount to receive an STK push
            </DialogDescription>
          </DialogHeader>

          {mpesaStatus === "success" ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-green-600 font-medium">{mpesaMessage}</p>
              <p className="text-sm text-muted-foreground mt-2">Enter your M-Pesa PIN on your phone to complete the transaction.</p>
            </div>
          ) : (
            <form onSubmit={handleMpesaSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mpesa-phone">Phone Number</Label>
                <Input
                  id="mpesa-phone"
                  type="tel"
                  placeholder="0712345678 or 254712345678"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mpesa-amount">Amount (KES)</Label>
                <Input
                  id="mpesa-amount"
                  type="number"
                  placeholder="1000"
                  min="1"
                  value={mpesaAmount}
                  onChange={(e) => setMpesaAmount(e.target.value)}
                  required
                />
              </div>
              {mpesaStatus === "error" && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {mpesaMessage}
                </div>
              )}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={mpesaLoading}>
                {mpesaLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending STK Push...
                  </>
                ) : (
                  "Pay with M-Pesa"
                )}
              </Button>
            </form>
          )}
        </div>
      )
    }

    if (selectedType === "stripe") {
      return (
        <div className="space-y-4">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <DialogTitle className="text-center text-xl">Card Payment</DialogTitle>
            <DialogDescription className="text-center">
              Secure payment powered by Stripe
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleStripeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-email">Email Address</Label>
              <Input
                id="stripe-email"
                type="email"
                placeholder="your@email.com"
                value={stripeEmail}
                onChange={(e) => setStripeEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-amount">Amount (USD)</Label>
              <Input
                id="stripe-amount"
                type="number"
                placeholder="100"
                min="1"
                value={stripeAmount}
                onChange={(e) => setStripeAmount(e.target.value)}
                required
              />
            </div>
            {stripeError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {stripeError}
              </div>
            )}
            <Button type="submit" className="w-full bg-[#635bff] hover:bg-[#5851db]" disabled={stripeLoading}>
              {stripeLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                "Pay with Card"
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              You will be redirected to Stripe's secure checkout page
            </p>
          </form>
        </div>
      )
    }

    // Bank Transfer and Invoice - Coming Soon
    return (
      <>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
            <Clock className="h-8 w-8 text-secondary" />
          </div>
          <DialogTitle className="text-center text-xl">Coming Soon</DialogTitle>
          <DialogDescription className="text-center text-base">
            <span className="font-semibold text-primary">{selectedMethod}</span> payment integration is currently
            under development.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          For immediate assistance with payments, please contact us directly via the enquiry form or WhatsApp.
        </div>
      </>
    )
  }

  return (
    <section className="bg-muted/30 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="mb-3 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Flexible Payment Options
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
            We support multiple payment methods to ensure seamless transactions
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <Card
                key={index}
                className="border-border text-center transition-all hover:shadow-md hover:border-secondary/50 cursor-pointer group"
                onClick={() => handleCardClick(method.title, method.type)}
              >
                <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-4 sm:pt-6">
                  <div className="mx-auto mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-secondary/20 transition-colors">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <CardTitle className="text-sm sm:text-base">{method.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-xs sm:text-sm text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </section>
  )
}
