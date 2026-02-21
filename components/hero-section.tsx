"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StoryModal } from "@/components/story-modal"

export function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [storyModalOpen, setStoryModalOpen] = useState(false)

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
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-primary text-balance">
              Our Story
            </h2>
            <p className="text-sm sm:text-base md:text-base text-foreground/70 leading-relaxed text-pretty mx-auto">
              The Oxic International Group was founded on a simple belief: global capital flows to opportunity, not geography. We recognized a critical gap in the East African investment ecosystem. The need for trusted, technology-enabled advisors who understand both international investor expectations and local market dynamics.
            </p>
            <div className="flex justify-center">
              <Button 
                asChild
                className="bg-primary hover:bg-primary/90 mt-4"
              >
                <Link href="/story">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main CTA Section - After Story */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mb-8 sm:mb-10 md:mb-12 lg:mb-14">
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
