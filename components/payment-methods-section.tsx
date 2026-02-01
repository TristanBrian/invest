"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Smartphone, CreditCard, FileText, Clock, Loader2, CheckCircle, AlertCircle, Download, ArrowLeft, Phone, Mail, Send, Printer, Zap, ChevronDown } from "lucide-react"

type PaymentStatus = "idle" | "form" | "processing" | "waiting" | "success" | "error"
type InvoiceStep = "form" | "preview" | "sent"

const paymentMethods = [
  { icon: Zap, title: "Cryptocurrency", description: "Binance Pay, Bitcoin & others", type: "crypto", featured: true },
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

  // Invoice fields
  const [invoiceStep, setInvoiceStep] = useState<InvoiceStep>("form")
  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [invoiceEmail, setInvoiceEmail] = useState("")
  const [invoiceAmount, setInvoiceAmount] = useState("")
  const [invoiceCurrency, setInvoiceCurrency] = useState("USD")
  const [invoiceDescription, setInvoiceDescription] = useState("")
  const [showWalletAddresses, setShowWalletAddresses] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState<"BTC" | "ETH" | "BNB" | null>(null)
  const [cryptoPaymentStep, setCryptoPaymentStep] = useState<"method" | "confirm">("method")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  const resetForm = () => {
    setPhone("")
    setAmount("")
    setEmail("")
    setName("")
    setPaymentStatus("form")
    setErrorMessage("")
    setTransactionId("")
    setInvoiceStep("form")
    setCompanyName("")
    setCompanyAddress("")
    setContactPerson("")
    setInvoiceEmail("")
    setInvoiceAmount("")
    setInvoiceDescription("")
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

  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
    return `OXIC-${year}${month}-${random}`
  }

  const handleInvoicePreview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName || !invoiceEmail || !invoiceAmount) {
      setErrorMessage("Please fill in all required fields")
      return
    }
    setInvoiceNumber(generateInvoiceNumber())
    setInvoiceStep("preview")
    setErrorMessage("")
  }

  const handleSendInvoice = async () => {
    setInvoiceLoading(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "invoice",
          data: {
            invoiceNumber,
            companyName,
            companyAddress,
            contactPerson,
            email: invoiceEmail,
            amount: invoiceAmount,
            currency: invoiceCurrency,
            description: invoiceDescription,
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        setInvoiceStep("sent")
      } else {
        setErrorMessage("Failed to send invoice. Please try again.")
      }
    } catch {
      setErrorMessage("Network error. Please try again.")
    } finally {
      setInvoiceLoading(false)
    }
  }

  const handleDownloadInvoice = () => {
    // Create printable invoice
    const printContent = document.getElementById("invoice-preview")
    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoiceNumber}</title>
              <style>
                body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e3a5f; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: bold; color: #1e3a5f; }
                .invoice-title { font-size: 28px; color: #1e3a5f; }
                .details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
                .section-title { font-weight: 600; color: #666; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; }
                .amount-box { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: right; }
                .amount { font-size: 32px; font-weight: bold; color: #1e3a5f; }
                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
                th { background: #f8f9fa; font-weight: 600; }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <div class="logo">THE OXIC INTERNATIONAL GROUP</div>
                  <div style="color:#666;margin-top:4px;">Investment Advisory Services</div>
                </div>
                <div style="text-align:right;">
                  <div class="invoice-title">INVOICE</div>
                  <div style="color:#666;">${invoiceNumber}</div>
                </div>
              </div>
              <div class="details">
                <div>
                  <div class="section-title">Bill To</div>
                  <div style="font-weight:600;">${companyName}</div>
                  <div>${companyAddress || "Address not provided"}</div>
                  <div>${contactPerson}</div>
                  <div>${invoiceEmail}</div>
                </div>
                <div>
                  <div class="section-title">Invoice Details</div>
                  <div><strong>Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                  <div><strong>Due Date:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                  <div><strong>Status:</strong> Pending</div>
                </div>
              </div>
              <table>
                <thead><tr><th>Description</th><th style="text-align:right;">Amount</th></tr></thead>
                <tbody><tr><td>${invoiceDescription || "Investment Advisory Services"}</td><td style="text-align:right;">${invoiceCurrency} ${parseFloat(invoiceAmount).toLocaleString()}</td></tr></tbody>
              </table>
              <div class="amount-box">
                <div style="color:#666;font-size:14px;">Total Amount Due</div>
                <div class="amount">${invoiceCurrency} ${parseFloat(invoiceAmount).toLocaleString()}</div>
              </div>
              <div class="footer">
                <strong>Payment Instructions:</strong><br/>
                Bank: KCB BANK (K) LIMITED<br/>
                Account Name: THE OXIC INTERNATIONAL GROUP LIMITED<br/>
                Account Number: 1316115194<br/>
                SWIFT Code: KCBLKENX<br/>
                M-Pesa Paybill: 522522<br/><br/>
                <strong>Contact:</strong> info@oxicinternational.co.ke
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const renderInvoiceContent = () => {
    if (invoiceStep === "sent") {
      return (
        <div className="text-center py-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Invoice Sent Successfully</h3>
          <p className="text-muted-foreground mb-4">Invoice <span className="font-mono font-medium">{invoiceNumber}</span> has been sent to <span className="font-medium">{invoiceEmail}</span></p>
          <div className="bg-muted/50 rounded-lg p-4 mb-4 text-left text-sm">
            <p className="font-medium mb-2">Next Steps:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>1. Review the invoice in your email</li>
              <li>2. Process payment via bank transfer</li>
              <li>3. Send payment confirmation to info@oxicinternational.co.ke</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" />Download PDF
            </Button>
            <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#152a45]" onClick={handleClose}>Done</Button>
          </div>
        </div>
      )
    }

    if (invoiceStep === "preview") {
      return (
        <div className="space-y-4">
          <DialogHeader className="pb-0">
            <DialogTitle className="text-center text-lg">Invoice Preview</DialogTitle>
          </DialogHeader>
          <div id="invoice-preview" className="border border-border rounded-lg overflow-hidden">
            <div className="bg-[#1e3a5f] text-white p-4">
              <div className="flex justify-between items-start">
                <div>
                  <Image src="/images/logo1.png" alt="Oxic Logo" width={140} height={40} className="h-8 w-auto brightness-0 invert mb-1" />
                  <p className="text-xs text-white/70">Investment Advisory Services</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">INVOICE</p>
                  <p className="text-xs text-white/70 font-mono">{invoiceNumber}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-background">
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Bill To</p>
                  <p className="font-semibold">{companyName}</p>
                  <p className="text-muted-foreground text-xs">{companyAddress || "—"}</p>
                  <p className="text-xs">{contactPerson}</p>
                  <p className="text-xs">{invoiceEmail}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Details</p>
                  <p className="text-xs"><span className="text-muted-foreground">Date:</span> {new Date().toLocaleDateString()}</p>
                  <p className="text-xs"><span className="text-muted-foreground">Due:</span> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="border-t border-b border-border py-3 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{invoiceDescription || "Investment Advisory Services"}</span>
                  <span className="font-medium">{invoiceCurrency} {parseFloat(invoiceAmount).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center bg-muted/50 rounded-lg p-3">
                <span className="font-medium">Total Due</span>
                <span className="text-xl font-bold text-[#1e3a5f]">{invoiceCurrency} {parseFloat(invoiceAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setInvoiceStep("form")}>
              <ArrowLeft className="h-4 w-4 mr-2" />Edit
            </Button>
            <Button variant="outline" className="bg-transparent" onClick={handleDownloadInvoice}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#152a45]" onClick={handleSendInvoice} disabled={invoiceLoading}>
              {invoiceLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              {invoiceLoading ? "Sending..." : "Send Invoice"}
            </Button>
          </div>
        </div>
      )
    }

    return (
      <form onSubmit={handleInvoicePreview} className="space-y-4">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#1e3a5f]/10">
            <FileText className="h-7 w-7 text-[#1e3a5f]" />
          </div>
          <DialogTitle className="text-center">Institutional Invoice</DialogTitle>
          <DialogDescription className="text-center">Generate a professional invoice for your organization</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="company-name">Company/Organization Name *</Label>
            <Input id="company-name" placeholder="Acme Corporation Ltd" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="company-address">Address</Label>
            <Input id="company-address" placeholder="123 Business Park, Nairobi" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-person">Contact Person</Label>
            <Input id="contact-person" placeholder="John Doe" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invoice-email">Email *</Label>
            <Input id="invoice-email" type="email" placeholder="accounts@company.com" value={invoiceEmail} onChange={(e) => setInvoiceEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invoice-currency">Currency</Label>
            <select id="invoice-currency" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={invoiceCurrency} onChange={(e) => setInvoiceCurrency(e.target.value)}>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="KES">KES - Kenyan Shilling</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invoice-amount">Amount *</Label>
            <Input id="invoice-amount" type="number" placeholder="10000" min="1" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} required />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="invoice-description">Service Description</Label>
            <Textarea id="invoice-description" placeholder="Investment Advisory Services - Q1 2026" className="resize-none h-16" value={invoiceDescription} onChange={(e) => setInvoiceDescription(e.target.value)} />
          </div>
        </div>
        {errorMessage && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="h-4 w-4" />{errorMessage}</div>}
        <Button type="submit" className="w-full bg-[#1e3a5f] hover:bg-[#152a45]">
          <FileText className="h-4 w-4 mr-2" />Generate Invoice Preview
        </Button>
        <div className="text-center pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Need assistance?</p>
          <div className="flex justify-center gap-4 text-xs">
              <a href="mailto:info@oxicinternational.co.ke" className="flex items-center gap-1 text-[#1e3a5f] hover:underline"><Mail className="h-3 w-3" />info@oxicinternational.co.ke</a>
            <a href="tel:+254700000000" className="flex items-center gap-1 text-[#1e3a5f] hover:underline"><Phone className="h-3 w-3" />+254 700 000 000</a>
          </div>
        </div>
      </form>
    )
  }

  const renderBankTransferContent = () => {
    return (
      <div className="space-y-4">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#1e3a5f]/10">
            <Building2 className="h-7 w-7 text-[#1e3a5f]" />
          </div>
          <DialogTitle className="text-center">Bank Transfer Details</DialogTitle>
          <DialogDescription className="text-center">Use the following details for wire transfers</DialogDescription>
        </DialogHeader>
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground text-sm">Bank Name</span>
            <span className="font-medium text-sm">KCB BANK (K) LIMITED</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground text-sm">Account Name</span>
            <span className="font-medium text-sm">THE OXIC INTERNATIONAL GROUP LIMITED</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground text-sm">Account Number (KES)</span>
            <span className="font-medium text-sm font-mono">1316115194</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground text-sm">SWIFT Code</span>
            <span className="font-medium text-sm font-mono">KCBLKENX</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground text-sm">M-Pesa Paybill</span>
            <span className="font-medium text-sm font-mono">522522</span>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">Use account number <span className="font-medium">1316115194</span> as reference for all transfers. For invoices and wire transfers, contact our accounts team.</p>
        </div>
        <Button className="w-full bg-[#1e3a5f] hover:bg-[#152a45]" onClick={() => window.location.href = "mailto:info@oxicinternational.co.ke?subject=Bank Transfer Inquiry"}>
          <Mail className="h-4 w-4 mr-2" />Contact Accounts Team
        </Button>
      </div>
    )
  }

  const cryptoWallets = {
    BTC: "1A1z7agoat7SfLcNQUok7XJRZJ72gYXxqM",
    ETH: "0x742d35Cc6634C0532925a3b844Bc7e7595f8c1f",
    BNB: "0x742d35Cc6634C0532925a3b844Bc7e7595f8c1f"
  }

  const handleBinancePayNow = () => {
    setCryptoPaymentStep("confirm")
  }

  const handleBinanceScanQR = () => {
    window.open("https://www.binance.com/en/pay", "_blank")
  }

  const handleDirectTransfer = (crypto: "BTC" | "ETH" | "BNB") => {
    setSelectedCrypto(crypto)
    setShowWalletAddresses(true)
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    console.log("[v0] Address copied to clipboard")
  }

  const handleConfirmPayment = () => {
    const cryptoName = selectedCrypto || "crypto"
    window.location.href = `https://wa.me/254748992777?text=I%20have%20initiated%20a%20${cryptoName}%20payment.%20Please%20confirm%20receipt%20-%20Tx%20ID:%20`
  }

  const renderCryptoContent = () => {
    if (cryptoPaymentStep === "confirm") {
      return (
        <>
          <DialogHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100/20">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <DialogTitle className="text-2xl">Payment Initiated</DialogTitle>
            <DialogDescription className="text-base">Your cryptocurrency transaction has been initiated via Binance Pay</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900 mb-3"><span className="font-semibold">Transaction Status:</span> Waiting for payment confirmation</p>
              <div className="space-y-2 text-xs text-green-800">
                <p>✓ Payment method: Binance Pay</p>
                <p>✓ Processing time: 1-5 minutes typically</p>
                <p>✓ Settlement: Automatic upon blockchain confirmation</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900"><span className="font-semibold">Next:</span> After Binance confirms payment, please notify us via WhatsApp with your transaction reference for order processing and delivery confirmation.</p>
            </div>

            <Button className="w-full bg-[#1e3a5f] hover:bg-[#152a45] h-11 font-semibold" onClick={handleConfirmPayment}>
              <Send className="h-5 w-5 mr-2" />Confirm Payment via WhatsApp
            </Button>

            <Button 
              variant="outline" 
              className="w-full h-10 bg-transparent"
              onClick={() => setCryptoPaymentStep("method")}
            >
              Back to Payment Options
            </Button>
          </div>
        </>
      )
    }

    return (
      <>
        <DialogHeader>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#F0B90B]/20 to-[#F0B90B]/10">
            <Zap className="h-7 w-7 text-[#F0B90B]" />
          </div>
          <DialogTitle className="text-2xl">Cryptocurrency Payment</DialogTitle>
          <DialogDescription className="text-base">Choose your preferred payment method</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-6">
          {/* Option 1: Binance Pay */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Option 1: Quick Payment via Binance</p>
            <p className="text-xs text-muted-foreground">Fastest and most secure method. Redirects to official Binance payment page.</p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="bg-[#F0B90B] hover:bg-[#E0A90A] text-black font-semibold h-12" 
                onClick={handleBinancePayNow}
              >
                <Zap className="h-5 w-5 mr-2" />Pay Now
              </Button>
              <Button 
                className="bg-[#F0B90B] hover:bg-[#E0A90A] text-black font-semibold h-12" 
                onClick={handleBinanceScanQR}
              >
                <Zap className="h-5 w-5 mr-2" />Scan QR
              </Button>
            </div>
          </div>

          <div className="border-t border-border/30"></div>

          {/* Option 2: Direct Transfer */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">Option 2: Send Crypto Directly</p>
            <p className="text-xs text-muted-foreground">Send from your wallet to our address. Click on a currency to reveal the wallet address.</p>
            
            {!showWalletAddresses ? (
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 bg-transparent"
                  onClick={() => handleDirectTransfer("BTC")}
                >
                  Bitcoin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 bg-transparent"
                  onClick={() => handleDirectTransfer("ETH")}
                >
                  Ethereum
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 bg-transparent"
                  onClick={() => handleDirectTransfer("BNB")}
                >
                  BNB/USDT
                </Button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-orange-50 to-orange-50/50 border border-orange-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-orange-900">{selectedCrypto} Payment Address</p>
                  <button 
                    onClick={() => setShowWalletAddresses(false)}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Hide
                  </button>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-orange-200">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Wallet Address</p>
                  <p className="font-mono text-xs break-all text-foreground mb-3 bg-muted/50 p-2 rounded">
                    {cryptoWallets[selectedCrypto as keyof typeof cryptoWallets]}
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full h-8 text-xs bg-[#1e3a5f] hover:bg-[#152a45]"
                    onClick={() => handleCopyAddress(cryptoWallets[selectedCrypto as keyof typeof cryptoWallets])}
                  >
                    Copy Address
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs text-yellow-800">
                  <p><span className="font-semibold">⚠ Security:</span> Verify address accuracy before sending. Do not share this address publicly.</p>
                </div>
              </div>
            )}
          </div>

          {/* Confirmation Message */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">After Payment:</span> Confirm your transaction via WhatsApp (+254 748 992 777) with your Transaction ID and amount. Your order will be processed immediately upon payment verification.
            </p>
          </div>

          <Button 
            className="w-full bg-[#1e3a5f] hover:bg-[#152a45] h-11 font-semibold" 
            onClick={handleConfirmPayment}
          >
            <Send className="h-5 w-5 mr-2" />Contact Support via WhatsApp
          </Button>
        </div>
      </>
    )
  }

  const renderModalContent = () => {
    if (selectedType === "crypto") return renderCryptoContent()
    if (selectedType === "mpesa") return renderMpesaContent()
    if (selectedType === "stripe") return renderStripeContent()
    if (selectedType === "invoice") return renderInvoiceContent()
    if (selectedType === "bank") return renderBankTransferContent()
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
        <div className="mx-auto max-w-6xl">
          {/* All Payment Methods - Single Row */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {/* Binance - Minimized First */}
            <Card className="border-2 border-[#F0B90B] bg-gradient-to-br from-[#F0B90B]/5 to-transparent transition-all hover:shadow-md hover:border-[#F0B90B] cursor-pointer group" onClick={() => handleCardClick("Cryptocurrency", "crypto")}>
              <CardHeader className="pb-2 px-3 pt-3">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0B90B]/20 group-hover:bg-[#F0B90B]/30 transition-colors">
                  <Zap className="h-4 w-4 text-[#F0B90B]" />
                </div>
                <CardTitle className="text-xs text-[#F0B90B]">Binance Pay</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-xs text-muted-foreground">BTC • ETH • USDT</p>
              </CardContent>
            </Card>

            {/* Other Payment Methods */}
            {paymentMethods.slice(1).map((method, index) => {
              const Icon = method.icon
              return (
                <Card key={index} className="border-border text-center transition-all hover:shadow-md hover:border-secondary/50 cursor-pointer group" onClick={() => handleCardClick(method.title, method.type)}>
                  <CardHeader className="pb-2 px-3 pt-3">
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-secondary/20 transition-colors">
                      <Icon className="h-4 w-4 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <CardTitle className="text-xs">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={selectedType === "invoice" ? "sm:max-w-2xl" : "sm:max-w-2xl"}>{renderModalContent()}</DialogContent>
      </Dialog>
    </section>
  )
}
