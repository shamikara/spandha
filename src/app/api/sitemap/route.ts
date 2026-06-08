import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

const MAX_PROPOSAL_URLS = 5000

type SitemapEntry = {
  url: string
  lastModified: string
  changeFrequency: 'daily' | 'hourly' | 'weekly' | 'monthly' | 'yearly'
  priority: number
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const baseUrl = getSiteUrl()
  const now = new Date().toISOString()

  const staticPages: SitemapEntry[] = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/proposals`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ]

  let proposalPages: SitemapEntry[] = []

  try {
    const publishedAdverts = await prisma.advert.findMany({
      where: { isPublished: true, isActive: true },
      select: { userId: true },
    })

    const publishedUserIds = Array.from(
      new Set(publishedAdverts.map((advert) => advert.userId))
    )

    if (publishedUserIds.length > 0) {
      const profiles = await prisma.profile.findMany({
        where: {
          isActive: true,
          userId: { in: publishedUserIds },
          user: { isNicVerified: true },
        },
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: MAX_PROPOSAL_URLS,
      })

      proposalPages = profiles.map((profile) => ({
        url: `${baseUrl}/proposals/${profile.id}`,
        lastModified: profile.updatedAt.toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Sitemap: failed to load proposal URLs', error)
  }

  const allPages = [...staticPages, ...proposalPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(page.url)}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
