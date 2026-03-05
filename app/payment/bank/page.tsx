"use client"

import Link from "next/link"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function BankPaymentPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const bankDetails = [
    {
      bank: "Kenya Commercial Bank",
      country: "Kenya",
      accountName: "OXIC Investments Ltd",
      accountNumber: "1234567890",
      swiftCode: "KCBLKENX",
      branchCode: "001",
    },
    {
      bank: "Standard Chartered Bank",
      country: "Kenya",
      accountName: "OXIC Investments Ltd",
      accountNumber: "0234567890",
      swiftCode: "SCBLKENX",
      branchCode: "001",
    },
  ]

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/payment" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payment Methods
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer Payment</CardTitle>
            <CardDescription>Direct bank transfer for wire payments and international transfers.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                Send funds directly to one of our bank accounts below. Please include your name or transaction reference 
                in the payment description for quick identification.
              </p>
            </div>

            <div className="space-y-6">
              {bankDetails.map((detail, idx) => (
                <div key={idx} className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">{detail.bank}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Account Name</p>
                      <div className="flex items-center gap-2 justify-between">
                        <p className="font-mono text-sm">{detail.accountName}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(detail.accountName, `name-${idx}`)}
                        >
                          {copied === `name-${idx}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Account Number</p>
                      <div className="flex items-center gap-2 justify-between">
                        <p className="font-mono text-sm">{detail.accountNumber}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(detail.accountNumber, `account-${idx}`)}
                        >
                          {copied === `account-${idx}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">SWIFT Code</p>
                        <div className="flex items-center gap-2 justify-between">
                          <p className="font-mono text-sm">{detail.swiftCode}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(detail.swiftCode, `swift-${idx}`)}
                          >
                            {copied === `swift-${idx}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Branch Code</p>
                        <div className="flex items-center gap-2 justify-between">
                          <p className="font-mono text-sm">{detail.branchCode}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(detail.branchCode, `branch-${idx}`)}
                          >
                            {copied === `branch-${idx}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-1">Processing Time</p>
                  <p>Local transfers: 1-2 business days | International transfers: 3-5 business days</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Payment Description</p>
                  <p>Include your name or invoice number in the payment description for quick identification.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Confirmation</p>
                  <p>Once received, we'll send you a confirmation email with transaction details.</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
