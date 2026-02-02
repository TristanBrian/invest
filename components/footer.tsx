"use client"

import React from "react"

import Image from "next/image"
import { Mail, Phone, MapPin, Instagram, Linkedin, TrendingUp } from "lucide-react"

export function Footer() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <div className="inline-block">
              <Image
                src="/images/logo1.png"
                alt="The Oxic International Group"
                width={280}
                height={80}
                className="h-20 w-auto object-contain"
                quality={100}
              />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {
                "Bridging global capital, technology, and people to unlock East Africa's exceptional growth potential through expert investor liaison and execution services."
              }
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{"Quick Links"}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#services"
                  onClick={(e) => scrollToSection(e, "services")}
                  className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  {"Services"}
                </a>
              </li>
              <li>
                <a
                  href="#value"
                  onClick={(e) => scrollToSection(e, "value")}
                  className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  {"Value Proposition"}
                </a>
              </li>
              <li>
                <a
                  href="#founder"
                  onClick={(e) => scrollToSection(e, "founder")}
                  className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  {"Our Founder"}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, "contact")}
                  className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  {"Contact"}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{"Contact Us"}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="mailto:oxicgroupltd@group.com" className="transition-colors hover:text-foreground">
                  {"oxicgroupltd@group.com"}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="tel:+254748992777" className="transition-colors hover:text-foreground">
                  {"+254 748 992 777"}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{"Nairobi, Kenya"}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{"Follow Us"}</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="TikTok"
              >
                <TrendingUp className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>{"© 2026 The Oxic International Group. All rights reserved."}</p>
         
        </div>
      </div>
    </footer>
  )
}
