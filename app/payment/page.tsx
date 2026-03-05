import Link from "next/link"
import { ArrowRight, Smartphone, CreditCard, Building2, Zap, FileText, Bank } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * Payment Methods Hub Page
 * Displays all available payment options with links to individual pages
 */

const paymentMethods = [
  {
    icon: Smartphone,
    title: "M-Pesa STK Push",
    description: "Quick mobile money payment via M-Pesa STK Push. Instant payment initiation.",
    href: "/payment/mpesa",
    badge: "Popular",
  },
  {
    icon: Building2,
    title: "KCB Bank Transfer",
    description: "Kenya Commercial Bank STK Push. Secure bank-initiated payment.",
    href: "/payment/kcb",
    badge: "New",
  },
  {
    icon: CreditCard,
    title: "Card Payments",
    description: "Visa, Mastercard, and other card payments. Powered by Stripe.",
    href: "/payment/card",
    badge: null,
  },
  {
    icon: Bank,
    title: "Bank Transfer",
    description: "Direct bank transfer instructions for wire payments worldwide.",
    href: "/payment/bank",
    badge: null,
  },
  {
    icon: Zap,
    title: "Cryptocurrency",
    description: "Pay with Bitcoin, Ethereum, or Binance Coin securely.",
    href: "/payment/crypto",
    badge: null,
  },
  {
    icon: FileText,
    title: "Invoice",
    description: "Request an invoice for corporate or institutional billing.",
    href: "/payment/invoice",
    badge: null,
  },
]

export const metadata = {
  title: "Payment Methods - OXIC",
  description: "Choose your preferred payment method. Multiple options available for your convenience.",
  openGraph: {
    title: "Payment Methods - OXIC",
    description: "Secure payment gateway with multiple payment options.",
  },
}

export default function PaymentHubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Choose Your Payment Method
          </h1>
          <p className="text-balance text-lg text-muted-foreground">
            Select from multiple secure payment options tailored to your needs. Fast, reliable, and secure transactions.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <Link key={method.href} href={method.href} className="group">
                <Card className="relative h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                  {method.badge && (
                    <div className="absolute right-4 top-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {method.badge}
                      </span>
                    </div>
                  )}

                  <CardHeader>
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{method.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Get started</span>
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Help Section */}
        <div className="mt-16 rounded-lg border border-border bg-card p-8">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">Need Help?</h2>
            <p className="mb-6 text-muted-foreground">
              We support multiple payment methods to make it convenient for you. If you have any questions about
              payments or need assistance, our team is here to help.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="default" asChild>
                <a href="mailto:support@oxic.co">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/docs/payments">Payment Documentation</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
