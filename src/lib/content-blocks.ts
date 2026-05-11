import { prisma } from './prisma'
import { BlockType, Locale } from '@prisma/client'

export interface ContentBlock {
  id: string
  key: string
  locale: Locale
  type: BlockType
  content: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HeroContent {
  title: string
  subtitle: string
  cta: string
}

export interface BannerContent {
  imageUrl: string
  link: string
  text: string
}

export interface AdvertContent {
  title: string
  image: string
  link: string
}

function parseLocale(value: string): Locale {
  return value === Locale.SI ? Locale.SI : Locale.EN
}

export async function getContentBlock(key: string, locale: string = 'EN'): Promise<any | null> {
  try {
    const requestedLocale = parseLocale(locale)

    // Try to get block for specific locale
    let block = await prisma.contentBlock.findFirst({
      where: { key, locale: requestedLocale, isActive: true },
    })

    // Fallback to EN if locale not found
    if (!block && requestedLocale !== Locale.EN) {
      block = await prisma.contentBlock.findFirst({
        where: { key, locale: Locale.EN, isActive: true },
      })
    }

    if (!block) {
      return null
    }

    return JSON.parse(block.content)
  } catch (error) {
    console.error('Error fetching content block:', error)
    return null
  }
}

export async function getAllActiveBlocks(locale: string = 'EN'): Promise<ContentBlock[]> {
  try {
    const requestedLocale = parseLocale(locale)
    const blocks = await prisma.contentBlock.findMany({
      where: { locale: requestedLocale, isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    return blocks.map(block => ({
      ...block,
      content: JSON.parse(block.content),
    }))
  } catch (error) {
    console.error('Error fetching content blocks:', error)
    return []
  }
}
