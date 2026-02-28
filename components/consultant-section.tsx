"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Globe, Lock, Zap } from "lucide-react"

export function ConsultantSection() {
  const [imageLoaded, setImageLoaded] = useState(false)

  const expertise = [
    {
      icon: Globe,
      title: "Cross-Border Investments",
      description: "Structuring and executing international investment strategies across multiple jurisdictions",
    },
    {
      icon: TrendingUp,
      title: "Capital Raising",
      description: "Institutional funding sourcing and capital structure optimization for growth",
    },
    {
      icon: Lock,
      title: "Institutional Loan Advisory",
      description: "Securing and structuring institutional credit facilities with favorable terms",
    },
    {
      icon: Zap,
      title: "Digital Asset Financing",
      description: "Transparent and scalable blockchain-based financial solutions and tokenization strategies",
    },
  ]

  return (
    <section className="bg-gradient-to-b from-background to-muted/20 py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">Expert Advisory</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Foreign Investment & Financial Strategy
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground text-pretty">
            Strategic guidance from seasoned financial professionals specializing in cross-border capital and institutional finance
          </p>
        </div>

        {/* Main Profile Card */}
        <Card className="mx-auto max-w-5xl overflow-hidden border-border shadow-lg hover:shadow-xl transition-shadow duration-300 mb-12">
          <div className="grid gap-0 md:grid-cols-5 md:gap-12">
            {/* Image Section */}
            <div className="md:col-span-2 relative h-96 md:h-auto">
              <div className="relative h-full overflow-hidden bg-muted/30">
                {!imageLoaded && <div className="absolute inset-0 bg-muted/50 animate-pulse z-10" />}
                <Image
                  src="/images/isaac-limo.jpg"
                  alt="Hon. Isaac Limo, Foreign Investment & Financial Strategy Consultant"
                  fill
                  className={`object-cover object-center transition-opacity duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                  onLoad={() => setImageLoaded(true)}
                />
              </div>

              {/* Credential Badge */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                <p className="text-sm font-semibold">Expert in</p>
                <p className="text-xl font-bold">Tech-Finance Integration</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-0 md:col-span-3 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-widest text-secondary font-semibold mb-2">Consultant</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground">Hon. Isaac Limo</h3>
                  <p className="text-lg text-secondary mt-2 font-semibold">
                    Foreign Investment & Financial Strategy Consultant
                  </p>
                </div>

                <div className="space-y-3 text-base leading-relaxed text-foreground/85">
                  <p>
                    An experienced foreign and financial investment consultant with strong academic foundations in Software Engineering,
                    Information Technology, and Finance.
                  </p>
                  <p>
                    Specializes in structuring cross-border investments, capital raising, institutional loan advisory, and digital asset
                    financing across East African and international markets.
                  </p>
                  <p>
                    Combines expertise at the intersection of technology and finance to deliver secure, transparent, and scalable financial
                    solutions for investors, corporate entities, and international partners.
                  </p>
                </div>
              </div>

              <Button
                asChild
                className="mt-8 w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-semibold group"
              >
                <a href="#inquiry">
                  Consult an Expert
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </Card>

        {/* Expertise Grid */}
        <div className="mx-auto max-w-5xl">
          <h3 className="text-center text-xl font-bold text-foreground mb-8 md:mb-10">Core Expertise Areas</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {expertise.map((item, index) => {
              const Icon = item.icon
              return (
                <Card
                  key={index}
                  className="p-6 border-border hover:shadow-lg hover:border-secondary transition-all duration-300 group cursor-pointer"
                >
                  <div className="mb-4">
                    <div className="inline-flex p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-bold text-foreground mb-2 text-sm">{item.title}</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">{item.description}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Strategic Value Proposition */}
        <div className="mx-auto max-w-5xl mt-12 md:mt-16">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 p-8 md:p-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Why Consult Hon. Isaac Limo?</h3>
              <p className="text-foreground/80 leading-relaxed">
                In an increasingly complex global financial landscape, having a trusted advisor who bridges technology, finance, and
                cross-border expertise is essential. Isaac brings institutional credibility, market intelligence, and a proven track record
                of structuring deals that deliver value for all stakeholders.
              </p>
              <ul className="space-y-3 text-foreground/75">
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold mt-0.5 flex-shrink-0">
                    ✓
                  </span>
                  <span>Combines financial acumen with deep tech infrastructure knowledge</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold mt-0.5 flex-shrink-0">
                    ✓
                  </span>
                  <span>Proven expertise in securing institutional capital and favorable credit terms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold mt-0.5 flex-shrink-0">
                    ✓
                  </span>
                  <span>Strategic positioning in digital asset and blockchain-enabled financing</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
