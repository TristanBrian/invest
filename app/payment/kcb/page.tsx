"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PaymentStatus = "idle" | "loading" | "success" | "error"

export default function KcbPaymentPage() {
  const [status, setStatus] = useState<PaymentStatus>("idle")
  const [error, setError] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [loading, setLoading] = useState(false)

  // Form state
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setStatus("idle")

    try {
      const response = await fetch("/api/kcb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone,
          amount: Number(amount),
          customerEmail: email,
          customerName: name,
          transactionDesc: "OXIC Payment",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setTransactionId(data.transactionId)
        setPhone("")
        setAmount("")
        setEmail("")
        setName("")
      } else {
        setStatus("error")
        setError(data.error || "Payment failed. Please try again.")
      }
    } catch (err) {
      setStatus("error")
      setError("Network error. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/payment" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payment Methods
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>KCB STK Push Payment</CardTitle>
            <CardDescription>
              Secure payment via Kenya Commercial Bank. You'll receive a prompt on your registered phone.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {status === "success" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">Payment Initiated!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Check your phone for the KCB STK Push prompt. Enter your KCB PIN to complete the payment.
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Transaction ID:</strong>
                  </p>
                  <p className="break-all font-mono text-sm">{transactionId}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">What happens next:</p>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li>1. Check your phone for the KCB STK prompt</li>
                    <li>2. Enter your KCB PIN when prompted</li>
                    <li>3. You'll receive a confirmation message from KCB</li>
                    <li>4. We'll send you a receipt via email</li>
                  </ol>
                </div>

                <Button onClick={() => setStatus("idle")} className="w-full">
                  Make Another Payment
                </Button>
              </div>
            ) : status === "error" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">Payment Failed</h3>
                  <p className="mt-2 text-muted-foreground">{error}</p>
                </div>

                <Button onClick={() => setStatus("idle")} variant="outline" className="w-full">
                  Try Again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="0712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">Kenya phone (0712345678 or +254712345678)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      max="150000"
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">1 - 150,000 KES</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (Optional)</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">We'll send you a receipt here</p>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-900">
                    You'll receive an STK Push prompt on your registered KCB phone. Enter your KCB PIN to authorize the payment.
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Initiate KCB Payment"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">How KCB STK Push Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">1. Enter Your Details</p>
              <p>Provide your phone number, amount, and optional email for receipt.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">2. Receive STK Prompt</p>
              <p>You'll immediately receive a KCB STK Push prompt on your registered phone.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">3. Enter Your PIN</p>
              <p>Simply enter your KCB PIN on the prompt to authorize the payment.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">4. Instant Confirmation</p>
              <p>You'll receive a KCB confirmation message and an email receipt.</p>
            </div>
            <div className="border-t pt-4">
              <p className="font-semibold text-foreground mb-2">About KCB STK Push</p>
              <p className="mb-2">
                KCB's STK Push uses Kenya Commercial Bank's secure OAuth2 authentication to provide a safe payment experience.
              </p>
              <p>
                The payment is processed through the Buni payment gateway, ensuring enterprise-grade security and reliability.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
