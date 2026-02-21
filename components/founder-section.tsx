"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Linkedin } from "lucide-react"

export function FounderSection() {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <section id="founder" className="bg-muted/30 py-8 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">{"Meet Our Founder"}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            {"Leadership rooted in experience, integrity, and deep market knowledge"}
          </p>
        </div>

        <Card className="mx-auto max-w-5xl overflow-hidden border-border">
          <div className="grid gap-8 p-8 md:grid-cols-5 md:gap-12 md:p-12">
            <div className="md:col-span-2">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/30 shadow-lg">
                {!imageLoaded && <div className="absolute inset-0 bg-muted/50 animate-pulse" />}
                <Image
                  src="/images/founder-francis-kiame.jpeg"
                  alt="Francis Kiame, Founder & Managing Director"
                  fill
                  className={`object-cover object-top transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
              <a
                href="https://www.linkedin.com/in/francis-kiame-a4a46294/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-4 w-full px-5 py-3 bg-[#0077b5] hover:bg-[#005885] text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Linkedin className="h-5 w-5" />
                <span>Connect</span>
              </a>
            </div>

            <div className="flex flex-col justify-center space-y-6 md:col-span-3">
              <div>
                <h3 className="mb-1 text-2xl font-bold text-foreground">{"Francis Kiame"}</h3>
                <p className="text-lg text-secondary">{"Founder & Managing Director"}</p>
              </div>

              <div className="space-y-4 text-base leading-relaxed text-foreground/80">
                <p>
                  {
                    "We are building a people-centric, ICT-driven investor liaison and execution platform designed to help global investors enter and scale in Kenya and East Africa with speed, confidence, and reduced risk."
                  }
                </p>
                <p>
                  {
                    "By combining deep local market intelligence, technology-enabled investor journey management, and hands-on stakeholder engagement, we remove the friction, opacity, and execution gaps that typically undermine investments in emerging markets."
                  }
                </p>
                <p>
                  {
                    "Positioned as a trusted on-the-ground partner, we bridge global capital with bankable opportunities, institutional partners, and scalable growth."
                  }
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Investment Thesis Quote - Full Width */}
        <blockquote className="mx-auto max-w-5xl mt-8 border-l-4 border-secondary bg-muted/50 p-8 md:p-12 italic text-foreground/90 rounded-r-lg">
          <p className="text-lg md:text-xl leading-relaxed text-justify">
            <span className="text-4xl font-serif text-primary/40 align-middle">"</span>
            <span className="inline">We are raising strategic capital to strengthen our digital infrastructure, expand regional coverage, and scale a high-margin advisory and execution model serving global investors seeking disciplined entry and sustainable returns in East Africa.</span>
            <span className="text-4xl font-serif text-primary/40 align-middle">"</span>
          </p>
        </blockquote>
      </div>
    </section>
  )
}
