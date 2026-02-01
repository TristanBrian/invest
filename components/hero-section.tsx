"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <section className="relative w-full">
      {/* Banner Image */}
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] shadow-lg bg-primary/10">
        {!imageLoaded && <div className="absolute inset-0 bg-primary/10 animate-pulse" />}
        <Image
          src="/images/hero-banner.jpeg"
          alt="Bridging Global Capital, Technology & People"
          fill
          className={`object-cover object-center transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          priority
          quality={85}
          sizes="100vw"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Company Story Section - Right After Banner */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Story Text */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                  Our Story
                </h2>
                <p className="text-base sm:text-lg text-foreground/70 leading-relaxed">
                  The Oxic International Group was founded on a simple belief: global capital flows to opportunity, not geography. We recognized a critical gap in the East African investment ecosystem. The need for trusted, technology-enabled advisors who understand both international investor expectations and local market dynamics.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Deep Local Expertise</h3>
                    <p className="text-sm text-foreground/70">Extensive network across East African markets with proven track record in investor liaison.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Technology-Enabled Execution</h3>
                    <p className="text-sm text-foreground/70">Modern infrastructure and digital tools for seamless, transparent transactions.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Investor-Centric Approach</h3>
                    <p className="text-sm text-foreground/70">We work exclusively for global investors, ensuring complete alignment of interests.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 hover:border-primary/20 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">50+</div>
                  <p className="text-sm text-foreground/70">Successful Investment Transactions</p>
                </div>
                
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 hover:border-primary/20 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">$500M+</div>
                  <p className="text-sm text-foreground/70">Capital Deployed in East Africa</p>
                </div>
                
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 hover:border-primary/20 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">15+</div>
                  <p className="text-sm text-foreground/70">Countries with Investor Network</p>
                </div>
                
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 hover:border-primary/20 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-sm text-foreground/70">Dedicated Support & Execution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main CTA Section - After Story */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
        <div className="bg-secondary rounded-xl sm:rounded-2xl shadow-2xl border border-secondary-foreground/10 py-8 sm:py-10 md:py-14 lg:py-16 mx-2 sm:mx-4 md:mx-8 lg:mx-auto lg:max-w-5xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5 px-4 sm:px-6 md:px-8">
            <span className="inline-block px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-secondary bg-primary rounded-full shadow-md">
              Your Trusted Partner in East Africa
            </span>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-primary text-balance">
              Unlock Investment Opportunities with Confidence
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-primary/80 max-w-2xl mx-auto leading-relaxed text-pretty">
              We provide end-to-end investor liaison services, combining deep local market intelligence with
              technology-enabled execution to help global investors enter and scale in Kenya and East Africa.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-3 sm:pt-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="#services">Explore Our Services</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white text-sm sm:text-base font-semibold transition-all bg-white/50 backdrop-blur-sm"
              >
                <Link href="#contact">Book Advisory Session</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-12 sm:h-14 md:h-16 lg:h-20 bg-background"></div>
    </section>
  )
}
