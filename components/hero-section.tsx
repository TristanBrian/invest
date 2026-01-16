import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative w-full">
      {/* Banner Image */}
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] shadow-lg">
        <Image
          src="/images/hero-banner.jpeg"
          alt="Bridging Global Capital, Technology & People"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-8 sm:mt-10 md:mt-12 lg:mt-16">
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
