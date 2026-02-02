import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Our Story | The Oxic International Group",
  description: "Learn about our vision, mission, and track record in investor liaison services across East Africa.",
}

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="border-b border-border/30 sticky top-0 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <Link href="/#story">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
            The Oxic International Group Story
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed">
            Bridging global capital, technology, and people to unlock East Africa's exceptional growth potential
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Our Vision */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">Our Vision</h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              The Oxic International Group was founded on a simple belief: global capital flows to opportunity, not geography. We recognized a critical gap in the East African investment ecosystem. The need for trusted, technology-enabled advisors who understand both international investor expectations and local market dynamics.
            </p>
          </div>

          {/* What We Do */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">What We Do</h2>
            <p className="text-lg text-foreground/70 leading-relaxed mb-4">
              We bridge the gap between global capital and African opportunity. Our end-to-end investor liaison services combine deep local market intelligence with cutting-edge technology execution, enabling international investors to confidently enter, scale, and maximize returns across Kenya and East Africa.
            </p>
            <p className="text-lg text-foreground/70 leading-relaxed">
              By removing friction, opacity, and execution gaps that typically undermine investments in emerging markets, we position ourselves as the trusted on-the-ground partner connecting bankable opportunities, institutional stakeholders, and sustainable growth.
            </p>
          </div>

          {/* Competitive Advantages */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Our Competitive Advantages</h2>
            
            <div className="grid gap-6">
              {/* Advantage 1 */}
              <div className="border border-border/30 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">1</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-primary mb-2">Deep Local Expertise</h3>
                    <p className="text-foreground/70 leading-relaxed">
                      15+ years combined experience navigating East African markets. Our team understands regulatory landscapes, market dynamics, and investment nuances across multiple sectors including technology, real estate, agriculture, and financial services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advantage 2 */}
              <div className="border border-border/30 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">2</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-primary mb-2">Technology-Enabled Execution</h3>
                    <p className="text-foreground/70 leading-relaxed">
                      Modern infrastructure and digital tools for seamless, transparent transactions. Real-time tracking, secure payments, and automated documentation reduce friction and accelerate deal closure while maintaining institutional-grade compliance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advantage 3 */}
              <div className="border border-border/30 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">3</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-primary mb-2">Investor-Centric Approach</h3>
                    <p className="text-foreground/70 leading-relaxed">
                      We work exclusively for global investors, ensuring complete alignment of interests. Your success and capital preservation are our primary objectives, not maximizing transaction volume.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Track Record */}
          <div className="space-y-6 bg-muted/30 rounded-xl p-8 border border-border/30">
            <h2 className="text-3xl font-bold text-primary">Our Track Record</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-sm text-foreground/70">Successful Transactions</p>
              </div>

              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">$500M+</div>
                <p className="text-sm text-foreground/70">Capital Deployed</p>
              </div>

              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
                <p className="text-sm text-foreground/70">Countries Networked</p>
              </div>

              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-foreground/70">Dedicated Support</p>
              </div>
            </div>

            <div className="border-t border-border/30 pt-6 space-y-3">
              <h3 className="font-semibold text-primary text-lg">Investment Highlights</h3>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-lg">•</span>
                  <span className="text-foreground/70">Average deal closure time reduced by 60% vs. traditional advisors</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-lg">•</span>
                  <span className="text-foreground/70">Zero transaction failure rate due to rigorous due diligence and risk management</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-lg">•</span>
                  <span className="text-foreground/70">Client retention rate of 95%+ with repeat investments averaging 3x initial commitment</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Investment Thesis */}
          <div className="border-l-4 border-secondary bg-secondary/5 p-8 rounded-r-lg">
            <blockquote className="italic text-lg text-foreground/80 leading-relaxed">
              <span className="text-4xl font-serif text-primary/50">"</span>
              We are raising strategic capital to strengthen our digital infrastructure, expand regional coverage, and scale a high-margin advisory and execution model serving global investors seeking disciplined entry and sustainable returns in East Africa.
              <span className="text-4xl font-serif text-primary/50">"</span>
            </blockquote>
          </div>

          {/* CTA */}
          <div className="bg-primary text-white rounded-lg p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Explore Opportunities?</h3>
            <p className="text-primary/90">Let's discuss how we can help accelerate your investment journey in East Africa.</p>
            <Button asChild className="bg-white text-primary hover:bg-white/90" size="lg">
              <Link href="/#contact">Book Advisory Session</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
