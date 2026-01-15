import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Smartphone, CreditCard, FileText } from "lucide-react"

const paymentMethods = [
  {
    icon: Building2,
    title: "Bank Transfer",
    description: "International & local banking",
  },
  {
    icon: Smartphone,
    title: "Mobile Money",
    description: "M-Pesa & regional services",
  },
  {
    icon: CreditCard,
    title: "Card Payments",
    description: "Visa, Mastercard accepted",
  },
  {
    icon: FileText,
    title: "Institutional Invoicing",
    description: "DFI & corporate billing",
  },
]

export function PaymentMethodsSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">{"Flexible Payment Options"}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {"We support multiple payment methods to ensure seamless transactions"}
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-4">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <Card key={index} className="border-border text-center transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">{method.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
