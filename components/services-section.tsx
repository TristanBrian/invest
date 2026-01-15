import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, FileSearch, Network, Target } from "lucide-react"

const services = [
  {
    icon: FileSearch,
    title: "Investment Due Diligence",
    description:
      "Comprehensive market research, regulatory guidance, and stakeholder mapping to ensure informed investment decisions",
  },
  {
    icon: Network,
    title: "Market Entry Strategy",
    description:
      "Tailored entry strategies leveraging local partnerships, compliance frameworks, and operational setup",
  },
  {
    icon: Target,
    title: "Project Execution",
    description:
      "End-to-end project management, vendor coordination, and quality assurance for seamless implementation",
  },
  {
    icon: TrendingUp,
    title: "Growth & Scaling",
    description: "Strategic expansion support, talent acquisition, and ongoing operational optimization",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">{"Our Services"}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            {"Comprehensive support across your entire investment journey in East Africa"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="border-border bg-card transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/20">
                    <Icon className="h-7 w-7 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
