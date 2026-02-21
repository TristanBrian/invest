"use client"

import React, { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

export function LocationMap() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGetLocation = () => {
    if (typeof window !== "undefined") {
      window.open(
        "https://www.google.com/maps/place/The+Beacon/@-1.2949109,36.8098403,15z/data=!4m6!3m5!1s0x182f110017e5672d:0xd91cca1e1bf61235!8m2!3d-1.2949109!4d36.8098403",
        "_blank",
        "noopener,noreferrer"
      )
    }
  }

  if (!mounted) {
    return (
      <section className="py-6 md:py-8 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-1">{"Our Location"}</h2>
              <p className="text-muted-foreground text-sm">{"The Beacon Mall, Nairobi, Kenya"}</p>
            </div>
            <div className="w-full max-w-md bg-muted rounded-lg p-6 h-24" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">{"Our Location"}</h2>
            <p className="text-muted-foreground text-sm">{"The Beacon Mall, Nairobi, Kenya"}</p>
          </div>

          <button
            onClick={handleGetLocation}
            className="w-full max-w-md bg-card border-2 border-border hover:border-primary/50 rounded-lg p-6 transition-all hover:shadow-lg cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-foreground">{"The Beacon Mall"}</p>
                <p className="text-xs text-muted-foreground">{"View on Google Maps →"}</p>
              </div>
            </div>
          </button>

          <a
            href="tel:+254748992777"
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {"Call us for directions"}
          </a>
        </div>
      </div>
    </section>
  )
}
