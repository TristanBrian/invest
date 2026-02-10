import { lazy, Suspense } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ValuePropositionSection } from "@/components/value-proposition-section"
import { ServicesSection } from "@/components/services-section"
import { FounderSection } from "@/components/founder-section"
import { ContactSection } from "@/components/contact-section"
import { LocationMap } from "@/components/location-map"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"

// Lazy load PaymentMethodsSection with proper error boundary
const PaymentMethodsSection = lazy(() => import("@/components/payment-methods-section").then((mod) => ({ default: mod.PaymentMethodsSection })))

// Fallback loading component
function PaymentSectionFallback() {
  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container px-4">
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
      </div>
    </section>
  )
}

// Error boundary component
function PaymentSectionError() {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <p className="text-amber-900">Payment section temporarily unavailable. Please try again later.</p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ValuePropositionSection />
        <ServicesSection />
        <FounderSection />
        <Suspense fallback={<PaymentSectionFallback />}>
          <PaymentMethodsSection />
        </Suspense>
        <ContactSection />
        <div id="reviews">
          <ReviewsSection />
        </div>
        <LocationMap />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
