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
      <section className="bg-gradient-to-b from-primary/5 to-transparent container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 mb-6 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-sm font-semibold text-primary">Our Journey</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 text-balance">
            Who We Are
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-3xl mx-auto">
            We bridge global capital with African opportunity through trusted investor liaison, technology-enabled execution, and institutional-grade market intelligence.
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
          <div className="space-y-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-10 border border-primary/20">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Our Track Record</h2>
              <p className="text-lg text-foreground/60">Proven execution excellence across East Africa</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-white/50 rounded-lg p-6 border border-border/20">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-3">50+</div>
                <p className="text-sm font-medium text-foreground/70">Successful Transactions</p>
              </div>

              <div className="text-center bg-white/50 rounded-lg p-6 border border-border/20">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-3">$500M+</div>
                <p className="text-sm font-medium text-foreground/70">Capital Deployed</p>
              </div>

              <div className="text-center bg-white/50 rounded-lg p-6 border border-border/20">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-3">15+</div>
                <p className="text-sm font-medium text-foreground/70">Countries Networked</p>
              </div>

              <div className="text-center bg-white/50 rounded-lg p-6 border border-border/20">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-3">95%</div>
                <p className="text-sm font-medium text-foreground/70">Client Retention</p>
              </div>
            </div>

            <div className="border-t border-primary/10 pt-8 space-y-4">
              <h3 className="font-bold text-primary text-lg">Why Institutional Investors Trust Us</h3>
              <ul className="space-y-3 grid md:grid-cols-2 gap-4">
                <li className="flex gap-3 bg-white/30 rounded-lg p-4 border border-border/10">
                  <span className="text-primary font-bold text-2xl flex-shrink-0">✓</span>
                  <span className="text-foreground/75"><strong>60% faster</strong> deal closure vs traditional advisors</span>
                </li>
                <li className="flex gap-3 bg-white/30 rounded-lg p-4 border border-border/10">
                  <span className="text-primary font-bold text-2xl flex-shrink-0">✓</span>
                  <span className="text-foreground/75"><strong>Zero failures</strong> through rigorous due diligence</span>
                </li>
                <li className="flex gap-3 bg-white/30 rounded-lg p-4 border border-border/10">
                  <span className="text-primary font-bold text-2xl flex-shrink-0">✓</span>
                  <span className="text-foreground/75"><strong>3x repeat</strong> commitments from satisfied clients</span>
                </li>
                <li className="flex gap-3 bg-white/30 rounded-lg p-4 border border-border/10">
                  <span className="text-primary font-bold text-2xl flex-shrink-0">✓</span>
                  <span className="text-foreground/75"><strong>24/7</strong> institutional-grade support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Investment Thesis */}
          <div className="border-l-4 border-secondary bg-gradient-to-r from-secondary/10 to-transparent p-10 rounded-r-xl border-r border-border/20">
            <h3 className="text-lg font-semibold text-secondary mb-4">Our Investment Thesis</h3>
            <blockquote className="italic text-lg md:text-xl text-foreground/80 leading-relaxed font-serif">
              <span className="text-5xl text-primary/40 leading-none align-middle mr-3">"</span>
              <span className="inline">We are raising strategic capital to strengthen our digital infrastructure, expand regional coverage, and scale a high-margin advisory and execution model serving global investors seeking disciplined entry and sustainable returns in East Africa.</span>
              <span className="text-5xl text-primary/40 leading-none align-middle ml-3">"</span>
            </blockquote>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-12 text-center space-y-6 border border-primary/30 shadow-lg">
            <div className="space-y-3">
              <h3 className="text-3xl md:text-4xl font-bold">Ready to Explore Opportunities?</h3>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">Join 50+ successful institutional investors who have accelerated their East Africa portfolio growth with our guidance.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Link href="/#contact">Schedule Advisory Session</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 bg-transparent">
                <a href="mailto:oxicgroupltd@group.com">Contact Team</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
