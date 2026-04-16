'use client'

import { useState } from 'react'
import Link from 'next/link'
import Galaxy from './Galaxy'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Galaxy />
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-cream via-white to-wedding-cream dark:from-wedding-dark dark:via-gray-900 dark:to-wedding-dark">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23722f37' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
            Find Your Perfect
            <span className="block text-wedding-gold dark:text-wedding-maroon mt-2">
              Life Partner
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
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
              className="bg-white dark:bg-gray-800 text-wedding-maroon dark:text-wedding-gold border-2 border-wedding-maroon dark:border-wedding-gold hover:bg-wedding-maroon hover:text-white dark:hover:bg-wedding-gold dark:hover:text-wedding-dark font-medium py-4 px-8 rounded-lg transition-all duration-200 text-lg"
            >
              Browse Profiles
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold text-wedding-maroon dark:text-wedding-gold mb-2">
                10,000+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Verified Profiles</div>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-wedding-maroon dark:text-wedding-gold mb-2">
                500+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Success Stories</div>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-bold text-wedding-maroon dark:text-wedding-gold mb-2">
                98%
              </div>
              <div className="text-gray-600 dark:text-gray-400">Match Success</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-wedding-maroon dark:text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
