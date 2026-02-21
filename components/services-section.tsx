import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, FileSearch, Network, Target, CheckCircle } from "lucide-react"

const services = [
  {
    icon: FileSearch,
    title: "Investment Due Diligence",
    description:
      "Comprehensive market research, regulatory guidance, and stakeholder mapping to ensure informed investment decisions in East African markets.",
    features: ["Market Analysis", "Risk Assessment", "Regulatory Compliance", "Stakeholder Mapping"],
  },
  {
    icon: Network,
    title: "Market Entry Strategy",
    description:
      "Tailored entry strategies leveraging local partnerships, compliance frameworks, and operational setup for seamless market penetration.",
    features: ["Partnership Development", "Legal Structuring", "Licensing Support", "Local Registration"],
  },
  {
    icon: Target,
    title: "Project Execution",
    description:
      "End-to-end project management, vendor coordination, and quality assurance for seamless implementation of your investment projects.",
    features: ["Project Management", "Vendor Coordination", "Quality Assurance", "Timeline Management"],
  },
  {
    icon: TrendingUp,
    title: "Growth & Scaling",
    description:
      "Strategic expansion support, talent acquisition, and ongoing operational optimization to maximize your investment returns.",
    features: ["Expansion Strategy", "Talent Acquisition", "Operational Optimization", "Performance Tracking"],
  },
]

const stats = [
  { value: "50+", label: "Projects Executed" },
  { value: "12+", label: "Years Experience" },
  { value: "5", label: "East African Markets" },
  { value: "$100M+", label: "Investments Facilitated" },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-muted/30 py-8 sm:py-10 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-10 text-center">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-white bg-primary rounded-full">
            What We Offer
          </span>
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance text-primary">
            Our Services
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground text-pretty px-2">
            Comprehensive support across your entire investment journey in East Africa
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8 mb-10 sm:mb-12 md:mb-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className="border-border bg-card transition-all hover:shadow-lg hover:border-secondary/50 group"
              >
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-secondary/20 transition-colors">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-1 sm:mb-2">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {service.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium bg-secondary/10 text-primary rounded-full"
                          >
                            <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-secondary" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-primary rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10">
          <h3 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-white mb-6 sm:mb-8">
            Our Track Record
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
