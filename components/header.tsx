"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-10 sm:h-14 w-[150px] sm:w-[220px]">
            {!logoLoaded && <div className="absolute inset-0 bg-muted/50 animate-pulse rounded" />}
            <Image
              src="/images/logo.jpeg"
              alt="The Oxic International Group"
              width={220}
              height={60}
              className={`h-10 sm:h-14 w-auto transition-opacity duration-200 ${logoLoaded ? "opacity-100" : "opacity-0"}`}
              priority
              quality={90}
              onLoad={() => setLogoLoaded(true)}
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#services"
            onClick={(e) => scrollToSection(e, "services")}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground cursor-pointer"
          >
            Services
          </a>
          <a
            href="#value"
            onClick={(e) => scrollToSection(e, "value")}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground cursor-pointer"
          >
            Value Proposition
          </a>
          <a
            href="#founder"
            onClick={(e) => scrollToSection(e, "founder")}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground cursor-pointer"
          >
            Our Founder
          </a>
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "contact")}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground cursor-pointer"
          >
            Contact
          </a>
        </nav>

        <Button asChild className="hidden md:inline-flex">
          <a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>
            Book Advisory Session
          </a>
        </Button>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col px-4 py-4">
            <a
              href="#services"
              onClick={(e) => scrollToSection(e, "services")}
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground border-b border-border/50 cursor-pointer"
            >
              Services
            </a>
            <a
              href="#value"
              onClick={(e) => scrollToSection(e, "value")}
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground border-b border-border/50 cursor-pointer"
            >
              Value Proposition
            </a>
            <a
              href="#founder"
              onClick={(e) => scrollToSection(e, "founder")}
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground border-b border-border/50 cursor-pointer"
            >
              Our Founder
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "contact")}
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground cursor-pointer"
            >
              Contact
            </a>
            <Button asChild className="mt-4 w-full">
              <a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>
                Book Advisory Session
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
