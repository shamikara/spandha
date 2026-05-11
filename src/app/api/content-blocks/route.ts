import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BlockType, Locale } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function parseLocale(value: string | null): Locale {
  return value === Locale.SI ? Locale.SI : Locale.EN
}

function parseBlockType(value: unknown): BlockType | null {
  return typeof value === 'string' && Object.values(BlockType).includes(value as BlockType)
    ? (value as BlockType)
    : null
}

// Helper to verify admin
async function verifyAdmin(request: NextRequest) {
  const authUser = verifyToken(request)
  if (!authUser) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    })
    return user?.isAdmin ? user : null
  } catch {
    return null
  }
}

// GET all active blocks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const locale = parseLocale(searchParams.get('locale'))
    const includeInactive = searchParams.get('includeInactive') === 'true'

    if (key) {
      // Get specific block by key and locale
      let block = await prisma.contentBlock.findFirst({
        where: { key, locale, isActive: includeInactive ? undefined : true },
      })

      // Fallback to EN if locale not found
      if (!block && locale !== Locale.EN) {
        block = await prisma.contentBlock.findFirst({
          where: { key, locale: Locale.EN, isActive: includeInactive ? undefined : true },
        })
      }

      if (!block) {
        return NextResponse.json({ error: 'Block not found' }, { status: 404 })
      }
      return NextResponse.json({ content: JSON.parse(block.content), locale: block.locale })
    }

    // Get all active blocks for specific locale
    const blocks = await prisma.contentBlock.findMany({
      where: {
        locale,
        isActive: includeInactive ? undefined : true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const blocksWithContent = blocks.map(block => ({
      ...block,
      content: JSON.parse(block.content),
    }))

    return NextResponse.json({ blocks: blocksWithContent, locale })
  } catch (error) {
    console.error('Content blocks GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// CREATE new block (admin only)
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, type, content, locale } = body
    const blockType = parseBlockType(type)
    const blockLocale = parseLocale(locale)

    if (!key || !type || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!blockType) {
      return NextResponse.json({ error: 'Invalid block type' }, { status: 400 })
    }

    const block = await prisma.contentBlock.create({
      data: {
        key,
        type: blockType,
        content: JSON.stringify(content),
        locale: blockLocale,
      },
    })

    return NextResponse.json({
      block: {
        ...block,
        content: JSON.parse(block.content),
      },
    })
  } catch (error: any) {
    console.error('Content block CREATE error:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Block with this key and locale already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
