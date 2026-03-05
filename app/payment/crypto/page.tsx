"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CryptoPaymentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/payment" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payment Methods
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Cryptocurrency Payment</CardTitle>
            <CardDescription>Secure payment with Bitcoin, Ethereum, and Binance Coin.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  Cryptocurrency payment functionality is available in the payment methods section on the home page. 
                  Select your preferred digital currency and follow the instructions.
                </p>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">Supported Cryptocurrencies</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Bitcoin (BTC)</li>
                    <li>• Ethereum (ETH)</li>
                    <li>• Binance Coin (BNB)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Security</p>
                  <p>All transactions are secured using blockchain technology and cryptographic verification.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Advantages</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Fast international transfers</li>
                    <li>• Lower fees than traditional methods</li>
                    <li>• 24/7 availability</li>
                    <li>• Transparent and immutable</li>
                  </ul>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href="/">Back to Home - Crypto Payment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
