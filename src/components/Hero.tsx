'use client'

import { useState } from 'react'
import Link from 'next/link'
import Galaxy from './Galaxy'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Galaxy />
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero-bg.png')`,
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Hero Logo */}
        <div className="mb-8 animate-fade-in">
          <img
            src="/images/hero-logo.webp"
            alt="Spandha"
            className="h-24 md:h-32 w-auto mx-auto"
          />
        </div>

        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
            Find Your Perfect
            <span className="block text-wedding-gold mt-2">
              Life Partner
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Sri Lanka's most trusted matrimonial platform. Connect with verified profiles,
            find meaningful relationships, and start your journey to marriage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth"
              className="wedding-button text-lg px-8 py-4 inline-flex items-center justify-center"
            >
              Get Started
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link
              href="/proposals"
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white hover:bg-white hover:text-wedding-maroon font-medium py-4 px-8 rounded-lg transition-all duration-200 text-lg"
            >
              Browse Profiles
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold text-wedding-gold mb-2">
                10,000+
              </div>
              <div className="text-white/80">Verified Profiles</div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-wedding-gold mb-2">
                500+
              </div>
              <div className="text-white/80">Success Stories</div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-bold text-wedding-gold mb-2">
                98%
              </div>
              <div className="text-white/80">Match Success</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
