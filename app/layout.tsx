import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Oxic International Group | Bridging Global Capital to East Africa",
  description:
    "People-centric, ICT-driven investor liaison and execution platform for Kenya and East Africa. Enter and scale with speed, confidence, and reduced risk.",
  generator: "v0.app",
  icons: {
    icon: "/images/whatsapp-20image-202026-01-15-20at-2000.jpeg",
    apple: "/images/whatsapp-20image-202026-01-15-20at-2000.jpeg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
