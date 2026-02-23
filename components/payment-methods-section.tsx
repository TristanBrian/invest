"use client"

import React, { useState, useEffect } from "react"

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
type CryptoPaymentStep = "method" | "confirm"
type CryptoCurrency = "BTC" | "ETH" | "BNB"

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

const cryptoWallets = {
  BTC: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
  ETH: "0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE",
  BNB: "bnb1q33q99393q993q993q993q993q993q993q993",
}

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
  const [showQRCode, setShowQRCode] = useState(false)
  const [cryptoConfirmed, setCryptoConfirmed] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  // Crypto fields
  const [cryptoPaymentStep, setCryptoPaymentStep] = useState<CryptoPaymentStep>("method")
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | "">("")
  const [showWalletAddresses, setShowWalletAddresses] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  
  // Processing timeout tracking
  const [processingTimeRemaining, setProcessingTimeRemaining] = useState(0)
  const [processStartTime, setProcessStartTime] = useState<number | null>(null)

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
    setCryptoPaymentStep("method")
    setSelectedCrypto("")
    setShowWalletAddresses(false)
    setProcessingTimeRemaining(0)
    setProcessStartTime(null)
  }

  // Timer effect for processing state timeout (2 minutes)
  useEffect(() => {
    if (paymentStatus !== "processing" || !processStartTime) return

    const PROCESSING_TIMEOUT = 120000 // 2 minutes in milliseconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - processStartTime
      const remaining = Math.max(0, PROCESSING_TIMEOUT - elapsed)
      setProcessingTimeRemaining(Math.ceil(remaining / 1000))

      // Auto-timeout after 2 minutes
      if (remaining <= 0) {
        clearInterval(interval)
        setPaymentStatus("waiting")
      }
    }, 100)

    return () => clearInterval(interval)
  }, [paymentStatus, processStartTime])

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

    // Validate phone
    if (!phone || !/^(\+254|0)[0-9]{9}$/.test(phone.replace(/[\s-]/g, ""))) {
      setErrorMessage("Enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678)")
      return
    }

    // Validate amount
    if (!amount || parseFloat(amount) < 1 || parseFloat(amount) > 150000) {
      setErrorMessage("Enter a valid amount between KES 1 and KES 150,000")
      return
    }

    // Set processing state with start time
    console.log("[v0] Sending M-Pesa payment request:", {
      phoneNumber: phone,
      amount: parseFloat(amount),
    })
    
    setPaymentStatus("processing")
    setProcessStartTime(Date.now())
    setProcessingTimeRemaining(120)
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

      console.log("[v0] M-Pesa response status:", response.status)

      const data = await response.json()

      console.log("[v0] M-Pesa response data:", {
        success: data.success,
        error: data.error,
        responseCode: data.responseCode,
      })

      if (data.success) {
        // Payment initiated successfully - use professional transaction ID from API
        console.log("[v0] M-Pesa payment successful", {
          transactionId: data.transactionId,
          checkoutRequestID: data.checkoutRequestID,
        })
        
        setTransactionId(data.transactionId || data.checkoutRequestID || data.merchantRequestID || "PENDING")
        setPaymentStatus("waiting")
      } else {
        // Handle errors based on status code and response
        let errorMsg = data.error || "Payment initiation failed"

        console.error("[v0] M-Pesa payment failed with status:", response.status)

        if (response.status === 503) {
          // Credentials missing
          errorMsg =
            "M-Pesa is not configured. Missing credentials: " +
            (data.missingCredentials?.join(", ") || "Unknown") +
            ". Please contact support."
        } else if (response.status === 400) {
          // Validation or M-Pesa API error
          errorMsg = data.error || "Invalid payment details. Please check and try again."
        } else if (response.status === 500) {
          // Server error
          errorMsg = "Server error. Please try again later."
        }

        setErrorMessage(errorMsg)
        setPaymentStatus("error")
      }
    } catch (error) {
      console.error("[v0] M-Pesa submission error:", error)
      setErrorMessage("Network error. Please check your connection and try again.")
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
    setTransactionId(`STR-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`)

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

      if (!response.ok) {
        console.error("[v0] Stripe API error status:", response.status, "Response:", data)
        
        let errorMsg = data.error || "Payment system error"
        
        if (response.status === 503) {
          errorMsg = "Stripe payment is currently unavailable. Please try M-Pesa or Bank Transfer instead, or contact support."
        } else if (response.status === 400) {
          errorMsg = data.error || "Invalid payment details. Please check your information."
        } else if (response.status === 500) {
          errorMsg = "Server error processing payment. Please try again in a moment."
        }
        
        setErrorMessage(errorMsg)
        setPaymentStatus("error")
        return
      }
      
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        setErrorMessage(data.error || "Failed to create checkout session. Please try again.")
        setPaymentStatus("error")
      }
    } catch (error) {
      console.error("[v0] Stripe payment error:", error)
      const errorMsg = error instanceof Error ? error.message : "Network error"
      setErrorMessage(`Unable to process payment: ${errorMsg}. Please check your connection and try again.`)
      setPaymentStatus("error")
    }
  }

  const renderMpesaContent = () => {
    if (paymentStatus === "processing") {
      const progressPercent = Math.round(((120 - processingTimeRemaining) / 120) * 100)
      
      return (
        <div className="text-center py-8 space-y-6">
          {/* Animated processing indicator */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-green-500 animate-spin"></div>
              
              {/* Middle pulsing ring */}
              <div className="absolute inset-2 rounded-full border-2 border-green-200 animate-pulse"></div>
              
              {/* Inner icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-green-50 rounded-full p-3">
                  <Phone className="h-8 w-8 text-green-600 animate-bounce" style={{animationDelay: "0s"}} />
                </div>
              </div>
            </div>
          </div>

          {/* Status text */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Processing Payment</h3>
            <p className="text-muted-foreground">Sending STK push to your phone...</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300"
                style={{width: `${progressPercent}%`}}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">{processingTimeRemaining}s remaining</p>
          </div>

          {/* Payment details card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200 space-y-3 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Amount</p>
                <p className="text-lg font-bold text-green-600 mt-1">KES {parseFloat(amount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Phone</p>
                <p className="text-lg font-semibold text-foreground mt-1">{phone}</p>
              </div>
            </div>
            
            <div className="pt-3 border-t border-green-200">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Transaction ID</p>
              <p className="font-mono text-sm font-semibold text-green-700 break-all bg-white rounded px-2 py-2">{transactionId}</p>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-blue-900">What's happening?</p>
            <ul className="text-xs text-blue-800 space-y-1 text-left">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>M-Pesa prompt will appear on your phone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Enter your M-Pesa PIN to confirm payment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>You'll receive an SMS confirmation</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 bg-transparent"
              onClick={() => {
                setPaymentStatus("form")
                setProcessStartTime(null)
                setProcessingTimeRemaining(0)
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )
    }

    if (paymentStatus === "waiting") {
      return (
        <div className="text-center py-8 space-y-6">
          {/* Waiting for PIN indicator */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Phone className="h-10 w-10 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Status text */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Awaiting Your PIN</h3>
            <p className="text-muted-foreground">Please complete the transaction on your phone</p>
          </div>

          {/* Payment details reminder */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 space-y-3 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Amount</p>
                <p className="text-lg font-bold text-amber-600 mt-1">KES {parseFloat(amount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Phone</p>
                <p className="text-lg font-semibold text-foreground mt-1">{phone}</p>
              </div>
            </div>
            
            <div className="pt-3 border-t border-amber-200">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Transaction Reference</p>
              <p className="font-mono text-sm font-semibold text-amber-700 break-all bg-white rounded px-2 py-2">{transactionId}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-blue-900">M-Pesa Prompt on Your Phone:</p>
            <ol className="text-xs text-blue-800 space-y-1.5 text-left list-decimal list-inside">
              <li>You should see a popup asking for M-Pesa PIN</li>
              <li>Enter your 4-digit PIN to confirm</li>
              <li>Wait for confirmation SMS</li>
              <li>We'll update your payment status automatically</li>
            </ol>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 bg-transparent"
              onClick={() => {
                setPaymentStatus("error")
                setErrorMessage("Payment cancelled. The M-Pesa prompt expired. Please try again.")
                setProcessStartTime(null)
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel Transaction
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => setPaymentStatus("success")}
            >
              Confirm Payment
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">This page will automatically update when payment is confirmed</p>
        </div>
      )
    }

    if (paymentStatus === "success") {
      return (
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Payment Confirmed</h3>
            <p className="text-sm text-muted-foreground">Your payment has been received and is being processed</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 text-left space-y-3 border border-green-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount</p>
                <p className="text-lg font-bold text-green-600">KES {parseFloat(amount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                <p className="text-lg font-semibold">{phone}</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-green-200">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Transaction ID</p>
              <p className="font-mono text-sm font-semibold text-green-700 break-all">{transactionId}</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded p-2">
              <p className="text-xs text-blue-900">
                <span className="font-semibold">Note:</span> Keep your transaction ID for reference. A detailed invoice will be emailed shortly.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                const txData = {
                  transactionId,
                  amount: parseFloat(amount),
                  phone,
                  date: new Date().toISOString(),
                }
                const element = document.createElement("a")
                element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(txData, null, 2)))
                element.setAttribute("download", `receipt-${transactionId}.txt`)
                element.style.display = "none"
                document.body.appendChild(element)
                element.click()
                document.body.removeChild(element)
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            
            <Button 
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      )
    }

    // Default form - rendered when paymentStatus is "form" or "idle"
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
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={(paymentStatus as PaymentStatus) === "processing"}>
          {(paymentStatus as PaymentStatus) === "processing" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending STK Push...</> : "Pay with M-Pesa"}
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

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setInvoiceStep("sent")
      } else {
        setErrorMessage("Failed to send invoice. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Invoice send error:", error)
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
                  <Image src="/images/oxic-logo.png" alt="Oxic Logo" width={180} height={54} className="h-12 w-auto mb-2" />
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

  const handleBinancePayNow = () => {
    setCryptoPaymentStep("confirm")
  }

  const handleBinanceScanQR = () => {
    setShowQRCode(true)
    setSelectedCrypto("BTC")
    setIsFlipped(true)
  }

  const handleWhatsAppConfirm = () => {
    window.location.href = `https://wa.me/254748992777?text=I%20have%20completed%20a%20Binance%20Pay%20cryptocurrency%20transaction.%20Please%20confirm%20receipt%20-%20Tx%20ID:%20`
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
    if (showQRCode) {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Scan QR Code</DialogTitle>
            <DialogDescription className="text-center">Use Binance Pay app to scan and complete payment</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6 flex flex-col items-center">
            {/* Flip Card Container */}
            <div className="h-80 w-80 relative" style={{ perspective: "1000px" }}>
              <div 
                className="relative w-full h-full transition-transform duration-700 ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(0deg)" : "rotateY(90deg)",
                }}
              >
                {/* QR Code Front */}
                <div 
                  className="absolute w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-[#F0B90B]/30 shadow-lg flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <div className="bg-white rounded-xl p-4 inline-block">
                <svg 
                  className="w-52 h-52" 
                  viewBox="0 0 256 256" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Simplified Binance-style QR pattern */}
                  <rect width="256" height="256" fill="white"/>
                  <rect x="0" y="0" width="64" height="64" fill="black"/>
                  <rect x="10" y="10" width="44" height="44" fill="white"/>
                  <rect x="20" y="20" width="24" height="24" fill="black"/>
                  <rect x="192" y="0" width="64" height="64" fill="black"/>
                  <rect x="202" y="10" width="44" height="44" fill="white"/>
                  <rect x="212" y="20" width="24" height="24" fill="black"/>
                  <rect x="0" y="192" width="64" height="64" fill="black"/>
                  <rect x="10" y="202" width="44" height="44" fill="white"/>
                  <rect x="20" y="212" width="24" height="24" fill="black"/>
                  {/* Data pattern - Binance yellow accent */}
                  <rect x="80" y="80" width="96" height="96" fill="#F0B90B" opacity="0.15"/>
                  <rect x="100" y="100" width="56" height="56" fill="#F0B90B" opacity="0.3"/>
                  <rect x="110" y="110" width="36" height="36" fill="black" opacity="0.8"/>
                </svg>
                  </div>
                </div>

                {/* Wallet Address Back */}
                <div 
                  className="absolute w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300/50 shadow-lg flex flex-col items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="space-y-4 w-full text-center">
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Wallet Address</p>
                    <div className="bg-white rounded-lg p-3 border border-blue-200/50 break-all">
                      <p className="text-xs font-mono text-gray-900">{cryptoWallets[selectedCrypto as CryptoCurrency] || "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy"}</p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(cryptoWallets[selectedCrypto as CryptoCurrency] || "")
                      }}
                    >
                      Copy Address
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 w-full text-center">
              <div className="bg-[#F0B90B]/10 border border-[#F0B90B]/30 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-900">Send to Binance Pay</p>
                <p className="text-xs text-gray-600 mt-1">Scan QR with Binance app to send payment</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Payment secured via blockchain • Instant settlement • No intermediaries
              </p>
            </div>

            <div className="w-full space-y-2 pt-2">
              <Button 
                className="w-full bg-[#F0B90B] hover:bg-[#E0A90A] text-black font-semibold h-11"
                onClick={() => {
                  setCryptoConfirmed(true)
                  setShowQRCode(false)
                }}
              >
                Payment Scanned
              </Button>

              <Button 
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setIsFlipped(false)
                  setTimeout(() => setShowQRCode(false), 350)
                }}
              >
                Back
              </Button>
            </div>
          </div>
        </>
      )
    }

    if (cryptoConfirmed) {
      return (
        <>
          <DialogHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100/20 mx-auto">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl">Payment Complete</DialogTitle>
            <DialogDescription className="text-center">Please confirm via WhatsApp for order processing</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-green-900 font-semibold">✓ Binance Pay Transaction Initiated</p>
              <p className="text-xs text-green-800">Processing time: 1-5 minutes typically. Settlement is automatic upon blockchain confirmation.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900"><span className="font-semibold">Next Step:</span> Notify us via WhatsApp with your transaction ID for final confirmation and order delivery.</p>
            </div>

            <Button 
              className="w-full bg-[#1e3a5f] hover:bg-[#152a45] h-11 font-semibold"
              onClick={handleWhatsAppConfirm}
            >
              <Send className="h-5 w-5 mr-2" />Confirm via WhatsApp
            </Button>

            <Button 
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                setCryptoConfirmed(false)
                setShowQRCode(false)
              }}
            >
              Start Over
            </Button>
          </div>
        </>
      )
    }

    return (
      <>
        <DialogHeader>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#F0B90B]/20 to-[#F0B90B]/10 mx-auto">
            <Zap className="h-7 w-7 text-[#F0B90B]" />
          </div>
          <DialogTitle className="text-center text-2xl">Cryptocurrency Payment</DialogTitle>
          <DialogDescription className="text-center">Fast, secure, and instant transactions</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <p className="text-sm text-muted-foreground text-center">Choose your preferred payment method</p>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="bg-[#F0B90B] hover:bg-[#E0A90A] text-black font-semibold h-12 flex flex-col gap-1"
              onClick={handleBinancePayNow}
            >
              <Zap className="h-4 w-4" />
              <span className="text-xs">Pay Now</span>
            </Button>

            <Button 
              className="bg-[#F0B90B] hover:bg-[#E0A90A] text-black font-semibold h-12 flex flex-col gap-1"
              onClick={handleBinanceScanQR}
            >
              <Zap className="h-4 w-4" />
              <span className="text-xs">Scan QR</span>
            </Button>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Accepted:</span> Binance Pay, Bitcoin, Ethereum, USDT, and BNB via secure blockchain transfer
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            After payment, you'll be guided to confirm via WhatsApp for final verification and order processing.
          </p>
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

    if (paymentStatus === "error") {
      return (
        <div className="text-center py-8 space-y-6">
          {/* Error icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          {/* Error message */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Payment Failed</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">{errorMessage}</p>
          </div>

          {/* Error details card if transaction was initiated */}
          {transactionId && transactionId !== "PENDING" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Transaction Reference</p>
                <p className="font-mono text-sm font-semibold text-red-700 mt-1 break-all">{transactionId}</p>
                <p className="text-xs text-muted-foreground mt-2">Keep this for your records</p>
              </div>
            </div>
          )}

          {/* Troubleshooting info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-amber-900">What you can do:</p>
            <ul className="text-xs text-amber-800 space-y-1.5 text-left list-disc list-inside">
              <li>Check your internet connection</li>
              <li>Ensure your M-Pesa account has sufficient balance</li>
              <li>Try again with a different amount</li>
              <li>Wait a few minutes and retry</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={resetForm}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      )
    }

    return (
    <section className="bg-muted/30 py-8 sm:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">Flexible Payment Options</h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">Secure payment methods for seamless transactions</p>
        </div>
        <div className="mx-auto max-w-6xl">
          {/* All Payment Methods - Single Row */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {/* Binance - Minimized First */}
            <Card className="border-border text-center transition-all hover:shadow-md hover:border-secondary/50 cursor-pointer group" onClick={() => handleCardClick("Cryptocurrency", "crypto")}>
              <CardHeader className="pb-2 px-3 pt-3">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-secondary/20 transition-colors">
                  <Zap className="h-4 w-4 text-primary group-hover:text-secondary transition-colors" />
                </div>
                <CardTitle className="text-xs">Cryptocurrency</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-xs text-muted-foreground">Binance, BTC, ETH, USDT</p>
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
