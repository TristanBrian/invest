import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Oxic International | Investment Advisory & Payment Solutions",
  description:
    "Secure M-Pesa payment gateway and investment advisory platform for Kenya and East Africa. Fast, reliable, and regulated payment processing with professional transaction management.",
  keywords: [
    "M-Pesa payments",
    "investment advisory",
    "Kenya payments",
    "East Africa",
    "business solutions",
    "payment gateway",
    "secure transactions",
    "digital payments",
  ],
  authors: [{ name: "Oxic International Group" }],
  creator: "Oxic International Group",
  publisher: "Oxic International Group",
  metadataBase: new URL("https://oxicinternational.co.ke"),
  alternates: {
    canonical: "https://oxicinternational.co.ke",
  },
  icons: {
    icon: "/images/oxic-logo.png",
    apple: "/images/oxic-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://oxicinternational.co.ke",
    siteName: "Oxic International",
    title: "Oxic International | Investment Advisory & Payment Solutions",
    description:
      "Secure M-Pesa payment gateway and investment advisory platform for Kenya and East Africa",
    images: [
      {
        url: "/images/oxic-logo.png",
        width: 1200,
        height: 630,
        alt: "Oxic International Group",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oxic International | Investment Advisory & Payment Solutions",
    description:
      "Secure M-Pesa payment gateway and investment advisory platform for Kenya and East Africa",
    creator: "@OxicInternational",
    images: ["/images/oxic-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#667eea",
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://api.safaricom.co.ke" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
