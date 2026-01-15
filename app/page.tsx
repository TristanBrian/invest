import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ValuePropositionSection } from "@/components/value-proposition-section"
import { ServicesSection } from "@/components/services-section"
import { FounderSection } from "@/components/founder-section"
import { PaymentMethodsSection } from "@/components/payment-methods-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ValuePropositionSection />
        <ServicesSection />
        <FounderSection />
        <PaymentMethodsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
