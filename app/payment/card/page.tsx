"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CardPaymentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/payment" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payment Methods
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Card Payments</CardTitle>
            <CardDescription>Secure credit and debit card payments powered by Stripe.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  Card payment functionality is available in the payment methods section on the home page. 
                  Use Stripe's secure checkout to process your card payment.
                </p>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">Accepted Cards</p>
                  <p>Visa, Mastercard, American Express, and other major card networks.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Security</p>
                  <p>All card payments are processed through Stripe's secure, PCI-compliant payment system.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Processing</p>
                  <p>Instant payment processing with immediate confirmation.</p>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href="/">Back to Home - Card Payment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
