import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl()

  return {
    name: 'Spandha - Trusted Matrimonial Platform',
    short_name: 'Spandha',
    description:
      "Find your perfect life partner with Spandha, Sri Lanka's most trusted matrimonial platform.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#faf6f2',
    theme_color: '#722f37',
    lang: 'en',
    categories: ['lifestyle', 'social'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Browse Proposals',
        short_name: 'Browse',
        description: 'Browse matrimonial proposals',
        url: '/proposals',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      {
        name: 'My Profile',
        short_name: 'Profile',
        description: 'View and edit your profile',
        url: '/profile',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
    ],
    id: siteUrl,
  }
}
