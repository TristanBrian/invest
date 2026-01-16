import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative w-full">
      {/* Banner Image - Full width below header */}
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px]">
        <Image
          src="/images/hero-banner.jpeg"
          alt="Bridging Global Capital, Technology & People"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
      </div>

      {/* Content Section - Below the banner with gold background */}
      <div className="bg-secondary py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-semibold text-secondary bg-primary rounded-full">
              Your Trusted Partner in East Africa
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-primary text-balance">
              Unlock Investment Opportunities with Confidence
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary/80 max-w-3xl mx-auto leading-relaxed text-pretty px-2">
              We provide end-to-end investor liaison services, combining deep local market intelligence with
              technology-enabled execution to help global investors enter and scale in Kenya and East Africa.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 text-sm sm:text-base font-semibold shadow-lg"
              >
                <Link href="#services">Explore Our Services</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white text-sm sm:text-base font-semibold transition-all bg-transparent"
              >
                <Link href="#contact">Book Advisory Session</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
