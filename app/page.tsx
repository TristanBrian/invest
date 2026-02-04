import { lazy, Suspense } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ValuePropositionSection } from "@/components/value-proposition-section"
import { ServicesSection } from "@/components/services-section"
import { FounderSection } from "@/components/founder-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"

// Lazy load PaymentMethodsSection to prevent blocking on Stripe/external APIs
const PaymentMethodsSection = lazy(() =>
  import("@/components/payment-methods-section").then((mod) => ({
    default: mod.PaymentMethodsSection,
  }))
)

// Fallback loading component for payment section
function PaymentSectionFallback() {
  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container px-4">
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
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
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
