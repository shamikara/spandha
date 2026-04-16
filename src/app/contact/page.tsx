import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Spandha - Get in Touch',
  description: 'Contact Spandha for support, feedback, or inquiries. We\'re here to help you find your perfect life partner.',
  openGraph: {
    title: 'Contact Spandha',
    description: 'Get in touch with the Spandha team for support and inquiries.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-wedding-cream dark:bg-wedding-dark">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold">
            Contact Us
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
              Get in Touch
            </h2>
            
            <div className="space-y-6">
              <div className="wedding-card p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-wedding-gold rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-wedding-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-400">+94 11 234 5678</p>
                  </div>
                </div>
              </div>

              <div className="wedding-card p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-wedding-gold rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-wedding-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">support@spandha.lk</p>
                  </div>
                </div>
              </div>

              <div className="wedding-card p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-wedding-gold rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-wedding-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Office</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      123 Galle Road<br />
                      Colombo 03<br />
                      Sri Lanka
                    </p>
                  </div>
                </div>
              </div>

              <div className="wedding-card p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-wedding-gold rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-wedding-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Business Hours</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
              Send us a Message
            </h2>
            <ContactForm />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <div className="wedding-card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                How do I create a profile on Spandha?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Simply click on "Get Started" and register with your phone number. You'll receive an OTP for verification, 
                then you can create your profile and start browsing proposals.
              </p>
            </div>

            <div className="wedding-card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is my information safe on Spandha?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we take privacy and security very seriously. All profiles are verified, and your personal 
                information is encrypted and protected with industry-standard security measures.
              </p>
            </div>

            <div className="wedding-card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                How can I contact customer support?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You can reach us via phone at +94 11 234 5678, email at support@spandha.lk, or use the 
                contact form on this page. Our team is available during business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
