import { Metadata } from 'next'
import { useTranslation } from '@/hooks/useTranslation'

export const metadata: Metadata = {
  title: 'About Spandha - Trusted Matrimonial Platform in Sri Lanka',
  description: 'Learn about Spandha, Sri Lanka\'s most trusted matrimonial platform. Our mission is to help you find your perfect life partner.',
  openGraph: {
    title: 'About Spandha - Trusted Matrimonial Platform',
    description: 'Learn about Spandha, Sri Lanka\'s most trusted matrimonial platform.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-wedding-cream dark:bg-wedding-dark">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold">
            About Spandha
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission */}
        <div className="wedding-card p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            At Spandha, we believe that every individual deserves to find their perfect life partner. 
            Our mission is to create a safe, trusted, and user-friendly platform that connects 
            compatible individuals across Sri Lanka.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We combine traditional values with modern technology to help you find meaningful 
            relationships that lead to happy marriages.
          </p>
        </div>

        {/* Values */}
        <div className="wedding-card p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-wedding-maroon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Trust & Safety</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Every profile is verified to ensure authenticity and safety.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-wedding-maroon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Privacy First</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Your data is protected with enterprise-grade security.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-wedding-maroon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Cultural Respect</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We honor Sri Lankan traditions and cultural values.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-wedding-maroon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Success Focus</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We're committed to helping you find lasting happiness.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="wedding-card p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-wedding-gold mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-400">Years of Service</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-wedding-gold mb-2">50,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Couples</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-wedding-gold mb-2">100,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Verified Profiles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-wedding-gold mb-2">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400">Safety Rate</div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="wedding-card p-8">
          <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
            Our Team
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Spandha is powered by a dedicated team of professionals who are passionate about 
            bringing people together. Our team includes relationship experts, technology specialists, 
            and customer service professionals who work together to ensure your success.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We understand the importance of marriage in Sri Lankan culture and are committed to 
            helping you find a partner who shares your values and aspirations.
          </p>
        </div>
      </div>
    </div>
  )
}
