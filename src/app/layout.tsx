import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata, Viewport } from 'next'
import Navigation from '@/components/Navigation'
import Galaxy from '@/components/Galaxy'
import Footer from '@/components/Footer'
import { ToastProvider } from '@/components/ToastProvider'
import { getMetadataBase } from '@/lib/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: 'Spandha - Trusted Matrimonial Platform in Sri Lanka',
    template: '%s | Spandha',
  },
  description:
    "Find your perfect life partner with Spandha, Sri Lanka's most trusted matrimonial platform. Secure, verified profiles, advanced matching, and personalized service.",
  keywords: ['matrimonial', 'sri lanka', 'marriage', 'wedding', 'bride', 'groom', 'sinhala', 'tamil'],
  authors: [{ name: 'Spandha Team' }],
  applicationName: 'Spandha',
  appleWebApp: {
    capable: true,
    title: 'Spandha',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Spandha - Trusted Matrimonial Platform in Sri Lanka',
    description:
      "Find your perfect life partner with Spandha, Sri Lanka's most trusted matrimonial platform.",
    type: 'website',
    locale: 'en_LK',
    siteName: 'Spandha',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Spandha - Trusted Matrimonial Platform in Sri Lanka',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spandha - Trusted Matrimonial Platform in Sri Lanka',
    description:
      "Find your perfect life partner with Spandha, Sri Lanka's most trusted matrimonial platform.",
    images: ['/og-image.svg'],
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
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#722f37' },
    { media: '(prefers-color-scheme: dark)', color: '#2c1810' },
  ],
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
