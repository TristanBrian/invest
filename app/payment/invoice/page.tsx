"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function InvoicePaymentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/payment" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payment Methods
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Payment</CardTitle>
            <CardDescription>Request a formal invoice for corporate or institutional billing.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  Invoice payment functionality is available in the payment methods section on the home page. 
                  Fill out the invoice request form with your company and payment details.
                </p>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">What You'll Need</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Company name and address</li>
                    <li>• Contact person</li>
                    <li>• Email address</li>
                    <li>• Payment amount</li>
                    <li>• Preferred currency (USD, KES, EUR)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Process</p>
                  <ol className="mt-2 space-y-1">
                    <li>1. Submit your invoice request</li>
                    <li>2. Receive formal invoice via email</li>
                    <li>3. Process payment through your finance department</li>
                    <li>4. Receive confirmation and receipt</li>
                  </ol>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Timeline</p>
                  <p>Invoices are typically processed within 24 hours of request.</p>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href="/">Back to Home - Request Invoice</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
