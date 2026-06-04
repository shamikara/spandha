import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Galaxy from '@/components/Galaxy'
import Footer from '@/components/Footer'
import { ToastProvider } from '@/components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spandha - Trusted Matrimonial Platform in Sri Lanka',
  description: 'Find your perfect life partner with Spandha, Sri Lanka\'s most trusted matrimonial platform. Secure, verified profiles, advanced matching, and personalized service.',
  keywords: 'matrimonial, sri lanka, marriage, wedding, bride, groom, sinhala, tamil',
  authors: [{ name: 'Spandha Team' }],
  openGraph: {
    title: 'Spandha - Trusted Matrimonial Platform in Sri Lanka',
    description: 'Find your perfect life partner with Spandha, Sri Lanka\'s most trusted matrimonial platform.',
    type: 'website',
    locale: 'en_LK',
    url: 'https://spandha.lk',
    siteName: 'Spandha',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Spandha Matrimonial Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spandha - Trusted Matrimonial Platform in Sri Lanka',
    description: 'Find your perfect life partner with Spandha, Sri Lanka\'s most trusted matrimonial platform.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Galaxy />
        <ToastProvider>
          <div className="min-h-screen bg-transparent transition-colors duration-300 relative flex flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
