"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Mail, Phone, MapPin, Linkedin, Facebook } from "lucide-react"

// Twitter/X icon component
function TwitterIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.681-5.829 6.681h-3.328l7.687-8.876-8.156-10.623h6.57l4.888 6.469L17.56 2.25h.684zm-1.106 17.920h1.828L5.900 4.122H4.009l13.129 16.048z" />
    </svg>
  )
}

// YouTube icon component
function YouTubeIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export function Footer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    if (typeof document !== "undefined") {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [])

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-6 md:col-span-2">
            <div className="inline-block">
              <img
                src="/images/oxic-logo.png"
                alt="The Oxic International Group"
                className="h-28 w-auto object-contain"
              />
            </div>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61587849211090"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Facebook"
                title="Follow us on Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/107881812/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="LinkedIn"
                title="Connect on LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://x.com/theoxicintgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Twitter/X"
                title="Follow us on Twitter/X"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://www.youtube.com/channel/UCj5Rr5qxN4by-6Xzt2hnO_A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="YouTube"
                title="Subscribe on YouTube"
              >
                <YouTubeIcon />
              </a>
            </div>
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
              <li>
                <a
                  href="#reviews"
                  onClick={(e) => scrollToSection(e, "reviews")}
                  className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  {"Testimonials"}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{"Contact Us"}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <a href="mailto:oxicgroupltd@gmail.com" className="transition-colors hover:text-foreground">
                    {"oxicgroupltd@gmail.com"}
                  </a>
                  <a href="mailto:Info@oxicinternational.co.ke" className="transition-colors hover:text-foreground">
                    {"Info@oxicinternational.co.ke"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="tel:+254748992777" className="transition-colors hover:text-foreground">
                  {"+254 748 992 777"}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <span>{"The Beacon Mall"}</span>
                  <span className="text-xs">{"Nairobi, Kenya"}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>{"© 2026 The Oxic International Group. All rights reserved."}</p>
        </div>
      </div>
    </footer>
  )
}
