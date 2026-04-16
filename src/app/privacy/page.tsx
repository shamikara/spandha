import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Spandha Matrimonial Platform',
  description: 'Read Spandha\'s privacy policy to understand how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy - Spandha',
    description: 'Learn about Spandha\'s commitment to protecting your privacy and personal data.',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-wedding-cream dark:bg-wedding-dark">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="wedding-card p-8 mb-6">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At Spandha, we are committed to protecting your privacy and ensuring the security of your personal 
              information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our matrimonial platform.
            </p>
          </div>

          <div className="wedding-card p-8 mb-6">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Personal Information
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-6">
              <li>Full name and contact details (phone number, email)</li>
              <li>Date of birth and age</li>
              <li>Gender and location</li>
              <li>Education and employment information</li>
              <li>Physical attributes (height, etc.)</li>
              <li>Religious and cultural information</li>
              <li>Profile photographs</li>
              <li>Personal descriptions and preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Usage Information
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and time spent on our platform</li>
              <li>Search queries and filter preferences</li>
              <li>Communication with other users</li>
            </ul>
          </div>

          <div className="wedding-card p-8 mb-6">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>To create and manage your matrimonial profile</li>
              <li>To match you with compatible partners</li>
              <li>To facilitate communication between users</li>
              <li>To verify user identities and prevent fraud</li>
              <li>To improve our services and user experience</li>
              <li>To send important notifications and updates</li>
              <li>To ensure platform safety and security</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div className="wedding-card p-8 mb-6">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell, rent, or trade your personal information. We may share your information only in 
              the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>With other users for the purpose of matchmaking (only information you choose to display)</li>
              <li>With service providers who assist in operating our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>With your explicit consent</li>
            </ul>
          </div>

          <div className="wedding-card p-8 mb-6">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mt-3">
              <li>SSL encryption for data transmission</li>
              <li>Secure data storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Profile verification processes</li>
              <li>Secure authentication methods</li>
            </ul>
          </div>

          <div className="wedding-card p-8 mb-6">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Access and view your personal information</li>
              <li>Update or correct your information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of certain communications</li>
              <li>Request a copy of your data</li>
              <li>Restrict processing of your information</li>
            </ul>
          </div>

          <div className="wedding-card p-8 mb-6">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Cookies and Tracking
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, remember preferences, and 
              analyze usage patterns. You can control cookie settings through your browser preferences.
            </p>
          </div>

          <div className="wedding-card p-8 mb-6">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our platform is intended for adults seeking marriage partners. We do not knowingly collect 
              information from individuals under 18 years of age. If we become aware of such information, 
              we will delete it immediately.
            </p>
          </div>

          <div className="wedding-card p-8 mb-6">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </div>

          <div className="wedding-card p-8">
            <h2 className="text-2xl font-serif font-bold text-wedding-maroon dark:text-wedding-gold mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Email:</strong> privacy@spandha.lk</p>
              <p><strong>Phone:</strong> +94 11 234 5678</p>
              <p><strong>Address:</strong> 123 Galle Road, Colombo 03, Sri Lanka</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
