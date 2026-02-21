import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Zap, Users, Shield } from "lucide-react"

const values = [
  {
    icon: Globe,
    title: "Local Market Intelligence",
    description: "Deep on-the-ground insights and stakeholder networks across East Africa",
  },
  {
    icon: Zap,
    title: "Technology-Enabled Journey",
    description: "Digital platform for investor journey management and real-time insights",
  },
  {
    icon: Users,
    title: "Execution Partnership",
    description: "Hands-on support from due diligence to scaling operations",
  },
  {
    icon: Shield,
    title: "Risk Mitigation",
    description: "Reduced friction, opacity, and execution gaps for confident investments",
  },
]

export function ValuePropositionSection() {
  return (
    <section id="value" className="py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">{"Why Partner With Us"}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            {
              "We combine local expertise with global standards to deliver exceptional value for international investors"
            }
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="border-border transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">{value.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
