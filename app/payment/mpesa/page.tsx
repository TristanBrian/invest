"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PaymentStatus = "idle" | "loading" | "success" | "error"

export default function MpesaPaymentPage() {
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
      const response = await fetch("/api/mpesa", {
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
            <CardTitle>M-Pesa STK Push Payment</CardTitle>
            <CardDescription>Fast and secure mobile money payment. You'll receive a prompt on your phone.</CardDescription>
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
                    Check your phone for the M-Pesa STK Push prompt. Enter your M-Pesa PIN to complete the payment.
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
                    <li>1. Check your phone for the M-Pesa STK prompt</li>
                    <li>2. Enter your M-Pesa PIN when prompted</li>
                    <li>3. You'll receive a confirmation message</li>
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
                    <p className="text-xs text-muted-foreground">Kenya phone number (0712345678 or +254712345678)</p>
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
                    You'll receive an STK Push prompt on your phone. Enter your M-Pesa PIN to authorize the payment.
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Initiate M-Pesa Payment"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">How M-Pesa STK Push Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">1. Enter Your Details</p>
              <p>Provide your phone number, amount, and optional email for receipt.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">2. Receive STK Prompt</p>
              <p>You'll immediately receive an M-Pesa STK Push prompt on your phone.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">3. Enter Your PIN</p>
              <p>Simply enter your M-Pesa PIN on the prompt to authorize the payment.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">4. Instant Confirmation</p>
              <p>You'll receive an M-Pesa confirmation message and an email receipt.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
