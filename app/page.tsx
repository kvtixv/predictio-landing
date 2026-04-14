import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { AppPreview } from "@/components/landing/app-preview"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 bg-radial-primary" />
      <div className="pointer-events-none fixed inset-0 bg-radial-accent" />
      
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <AppPreview />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  )
}
