import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo.jpeg"
            alt="The Oxic International Group"
            width={220}
            height={60}
            className="h-14 w-auto"
            priority
            quality={100}
          />
        </Link>

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

        <Button asChild variant="ghost" className="md:hidden">
          <Link href="#contact">Contact</Link>
        </Button>
      </div>
    </header>
  )
}
