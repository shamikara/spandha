'use client'

import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-20 bg-wedding-maroon">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
          Ready to Find Your Life Partner?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of happy couples who found their perfect match through Spandha. 
          Your journey to a beautiful marriage starts here.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth"
            className="bg-wedding-gold hover:bg-wedding-gold/90 text-wedding-maroon font-bold py-4 px-8 rounded-lg transition-all duration-200 text-lg inline-flex items-center justify-center"
          >
            Start Your Journey
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <Link 
            href="/about"
            className="bg-transparent hover:bg-white/10 text-white font-medium py-4 px-8 rounded-lg border-2 border-white transition-all duration-200 text-lg"
          >
            Learn More
          </Link>
        </div>
        
        <div className="mt-12 text-white/80">
          <p className="text-sm">
            ✓ Free Registration ✓ Verified Profiles ✓ Secure Platform ✓ 24/7 Support
          </p>
        </div>
      </div>
    </section>
  )
}
