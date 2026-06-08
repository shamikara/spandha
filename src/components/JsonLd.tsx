import { getSiteUrl } from '@/lib/site'

export default function JsonLd() {
  const siteUrl = getSiteUrl()

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Spandha',
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        description:
          "Sri Lanka's trusted matrimonial platform for verified profiles and secure matchmaking.",
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@spandha.lk',
          availableLanguage: ['English', 'Sinhala'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Spandha',
        description: 'Find your perfect life partner with verified matrimonial profiles.',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: ['en-LK', 'si-LK'],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/proposals?location={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
