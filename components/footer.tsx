import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="space-y-4 md:col-span-2">
            <Image
              src="/images/logo.jpeg"
              alt="The Oxic International Group"
              width={200}
              height={45}
              className="h-12 w-auto"
            />
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {
                "Bridging global capital, technology, and people to unlock East Africa's exceptional growth potential through expert investor liaison and execution services."
              }
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {"Quick Links"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#services" className="text-muted-foreground transition-colors hover:text-foreground">
                  {"Services"}
                </Link>
              </li>
              <li>
                <Link href="#value" className="text-muted-foreground transition-colors hover:text-foreground">
                  {"Value Proposition"}
                </Link>
              </li>
              <li>
                <Link href="#founder" className="text-muted-foreground transition-colors hover:text-foreground">
                  {"Our Founder"}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground transition-colors hover:text-foreground">
                  {"Contact"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {"Contact Us"}
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="mailto:oxicgroupltd@gmail.com" className="transition-colors hover:text-foreground">
                  {"oxicgroupltd@gmail.com"}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="tel:+254704527743" className="transition-colors hover:text-foreground">
                  {"+254 704 527 743"}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{"Nairobi, Kenya"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>© 2026 The Oxic International Group. All rights reserved.</p>

          {/* Professional "Made with love" credit */}
          <p>
            Made with <span className="text-red-500">❤️</span> by{" "}
            <Link
              href="https://tristanbdev.netlify.app/"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
              rel="noopener noreferrer"
            >
              Tristan
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
