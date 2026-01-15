import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
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

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{"Quick Links"}</h3>
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

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{"Contact Us"}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="mailto:info@theoxic.com" className="transition-colors hover:text-foreground">
                  {"info@theoxic.com"}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <a href="tel:+254700000000" className="transition-colors hover:text-foreground">
                  {"+254 700 000 000"}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{"Nairobi, Kenya"}</span>
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
