"use client"

import { useState } from "react"
import Image from "next/image"
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
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600 mb-2">Expert Advisory</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl text-slate-900">
            Foreign Investment & Financial Strategy
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 text-pretty">
            Strategic guidance from seasoned financial professionals specializing in cross-border capital and institutional finance
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="mx-auto max-w-5xl overflow-hidden border border-amber-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-12 bg-white">
          <div className="grid gap-0 md:grid-cols-5 md:gap-12">
            {/* Image Section */}
            <div className="md:col-span-2 relative h-96 md:h-auto">
              <div className="relative h-full overflow-hidden bg-slate-100">
                {!imageLoaded && <div className="absolute inset-0 bg-slate-200 animate-pulse z-10" />}
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
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent p-6 text-white">
                <p className="text-sm font-semibold">Expert in</p>
                <p className="text-xl font-bold">Tech-Finance Integration</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-0 md:col-span-3 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-widest text-amber-600 font-semibold mb-2">Consultant</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Hon. Isaac Limo</h3>
                  <p className="text-lg text-amber-700 mt-2 font-semibold">
                    Foreign Investment & Financial Strategy Consultant
                  </p>
                </div>

                <div className="space-y-3 text-base leading-relaxed text-slate-700">
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

              <a
                href="#contact"
                className="mt-8 w-full md:w-auto inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 group"
              >
                Consult an Expert
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Expertise Grid */}
        <div className="mx-auto max-w-5xl">
          <h3 className="text-center text-xl font-bold text-slate-900 mb-8 md:mb-10">Core Expertise Areas</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {expertise.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="p-6 border border-amber-200 rounded-lg hover:shadow-lg hover:border-amber-400 transition-all duration-300 group cursor-pointer bg-white"
                >
                  <div className="mb-4">
                    <div className="inline-flex p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                      <Icon className="h-6 w-6 text-amber-700" />
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 text-sm">{item.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
