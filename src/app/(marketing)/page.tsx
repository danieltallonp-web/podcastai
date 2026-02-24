import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { PricingSection } from "@/components/landing/pricing-section"
import { Testimonials } from "@/components/landing/testimonials"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
    </>
  )
}
