"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo.jpeg"
            alt="The Oxic International Group"
            width={220}
            height={60}
            className="h-10 sm:h-14 w-auto"
            priority
            quality={100}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#services"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Services
          </Link>
          <Link
            href="#value"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Value Proposition
          </Link>
          <Link
            href="#founder"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Our Founder
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        <Button asChild className="hidden md:inline-flex">
          <Link href="#contact">Book Advisory Session</Link>
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
            <Link
              href="#services"
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground border-b border-border/50"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="#value"
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground border-b border-border/50"
              onClick={() => setIsMenuOpen(false)}
            >
              Value Proposition
            </Link>
            <Link
              href="#founder"
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground border-b border-border/50"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Founder
            </Link>
            <Link
              href="#contact"
              className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Button asChild className="mt-4 w-full">
              <Link href="#contact" onClick={() => setIsMenuOpen(false)}>
                Book Advisory Session
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
