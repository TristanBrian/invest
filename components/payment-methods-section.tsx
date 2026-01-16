"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Building2, Smartphone, CreditCard, FileText, Clock } from "lucide-react"

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string>("")

  const handleCardClick = (methodTitle: string) => {
    setSelectedMethod(methodTitle)
    setIsModalOpen(true)
  }

  return (
    <section className="bg-muted/30 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="mb-3 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Flexible Payment Options
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
            We support multiple payment methods to ensure seamless transactions
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <Card
                key={index}
                className="border-border text-center transition-all hover:shadow-md hover:border-secondary/50 cursor-pointer group"
                onClick={() => handleCardClick(method.title)}
              >
                <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-4 sm:pt-6">
                  <div className="mx-auto mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-secondary/20 transition-colors">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <CardTitle className="text-sm sm:text-base">{method.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-xs sm:text-sm text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Coming Soon Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
              <Clock className="h-8 w-8 text-secondary" />
            </div>
            <DialogTitle className="text-center text-xl">Coming Soon</DialogTitle>
            <DialogDescription className="text-center text-base">
              <span className="font-semibold text-primary">{selectedMethod}</span> payment integration is currently
              under development. We are working hard to bring you seamless payment options.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            For immediate assistance with payments, please contact us directly via the enquiry form or WhatsApp.
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
