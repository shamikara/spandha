import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import PremiumAdverts from '@/components/PremiumAdverts'
import { Stats, Testimonials } from '@/components/LazyComponents'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Spandha - Trusted Matrimonial Platform in Sri Lanka',
  description: 'Find your perfect life partner with Spandha, Sri Lanka\'s most trusted matrimonial platform. Secure, verified profiles, advanced matching, and personalized service.',
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <JsonLd />
      <Hero />
      <Features />
      <PremiumAdverts />
      <Stats />
      <Testimonials />
      <CTA />
    </main>
  )
}
