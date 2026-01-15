import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[650px] w-full md:h-[750px] lg:h-[800px]">
        <Image
          src="/images/hero-banner.jpeg"
          alt="Bridging Global Capital, Technology & People"
          fill
          className="object-cover object-[center_65%]"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl space-y-8 lg:max-w-4xl">
            <div className="space-y-4 rounded-2xl bg-primary/40 p-8 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-none">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance text-white md:text-5xl lg:text-7xl">
                {"Bridging Global Capital, Technology & People"}
              </h1>
              <div className="h-1 w-24 bg-secondary" />
              <p className="text-xl font-medium leading-relaxed text-white md:text-2xl text-pretty">
                {"Investor Journey • ICT Strategy • People-Centric Growth"}
              </p>
              <p className="text-lg leading-relaxed text-white/95 md:text-xl">
                {"Kenya | East Africa | Emerging Markets"}
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-primary hover:bg-secondary/90 text-base font-semibold shadow-lg"
              >
                <Link href="#services">Explore Our Platform</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-primary text-base font-semibold shadow-lg transition-all"
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
