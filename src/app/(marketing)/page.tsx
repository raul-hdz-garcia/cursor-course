import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { DemoSection } from "@/components/demo-section"
import { PricingSection } from "@/components/pricing-section"
import { FaqSection } from "@/components/faq-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import "./og-marketing-scope.css"

export default function Home() {
  return (
    <div className="og-marketing min-h-dvh w-full max-w-[100vw] overflow-x-clip bg-background font-sans text-foreground">
      <Header />
      <main className="w-full min-w-0">
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
