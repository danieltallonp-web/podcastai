import type { Metadata } from "next"
import { PricingSection } from "@/components/landing/pricing-section"

export const metadata: Metadata = {
  title: "Precios | PodcastAI",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl pt-12">
        <PricingSection />
      </div>
    </div>
  )
}
