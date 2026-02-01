"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
    setIsMenuOpen(false)
  }

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const scrolledStyles = mounted && isScrolled

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolledStyles ? "bg-background/98 shadow-lg border-b border-border" : "bg-background border-b border-border/50"} backdrop-blur-md`}>
      <div className="container mx-auto flex h-18 lg:h-22 items-center justify-between px-4 lg:px-6">
        <a href="#" onClick={scrollToTop} className="flex items-center cursor-pointer group">
          <div className={`relative transition-all duration-300 group-hover:scale-105 ${scrolledStyles ? "scale-95" : "scale-100"} px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-md border border-white/40 hover:shadow-lg transition-shadow`}>
            {!logoLoaded && <div className="absolute inset-0 bg-muted/20 animate-pulse rounded-lg" />}
            <Image
              src="/images/logo1.png"
              alt="The Oxic International Group"
              width={280}
              height={80}
              className={`h-14 sm:h-16 lg:h-20 w-auto object-contain transition-opacity duration-200 ${logoLoaded ? "opacity-100" : "opacity-0"}`}
              priority
              quality={100}
              onLoad={() => setLogoLoaded(true)}
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {[
            { id: "services", label: "Services" },
            { id: "value", label: "Value Proposition" },
            { id: "founder", label: "Our Founder" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => scrollToSection(e, item.id)}
              className="relative px-3 xl:px-4 py-2 text-sm font-medium text-foreground/70 transition-all duration-200 hover:text-foreground cursor-pointer rounded-md hover:bg-muted/50 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#c9a961] transition-all duration-300 group-hover:w-2/3 rounded-full" />
            </a>
          ))}
        </nav>

        {/* CTA Button - Desktop */}
        <Button
          asChild
          className="hidden lg:inline-flex bg-[#1e3a5f] hover:bg-[#152a45] text-white font-medium px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>
            Book Advisory Session
          </a>
        </Button>

        {/* Mobile Menu Button */}
        <button
          className="flex lg:hidden h-10 w-10 items-center justify-center rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="border-t border-border bg-background/98 backdrop-blur-md">
          <nav className="container mx-auto flex flex-col px-4 py-2">
            {[
              { id: "services", label: "Services" },
              { id: "value", label: "Value Proposition" },
              { id: "founder", label: "Our Founder" },
              { id: "contact", label: "Contact" },
            ].map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`py-3.5 px-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground hover:bg-muted/50 rounded-lg cursor-pointer ${index < 3 ? "border-b border-border/30" : ""}`}
              >
                {item.label}
              </a>
            ))}
            <Button
              asChild
              className="mt-3 mb-2 w-full bg-[#1e3a5f] hover:bg-[#152a45] text-white font-medium py-3 rounded-lg"
            >
              <a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>
                Book Advisory Session
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
