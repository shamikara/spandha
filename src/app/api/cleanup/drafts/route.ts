import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function authorizeCron(request: NextRequest): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error('CRON_SECRET is not configured')
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 })
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

async function cleanupDrafts() {
  const twentyOneDaysAgo = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)

  const result = await prisma.advert.deleteMany({
    where: {
      isPublished: false,
      updatedAt: {
        lt: twentyOneDaysAgo,
      },
    },
  })

  console.log(`Cleanup: Deleted ${result.count} inactive drafts`)

  return NextResponse.json({
    message: `Deleted ${result.count} inactive drafts`,
    count: result.count,
  })
}

/** Vercel Cron invokes GET. Manual runs can use POST. */
export async function GET(request: NextRequest) {
  try {
    const denied = authorizeCron(request)
    if (denied) return denied
    return await cleanupDrafts()
  } catch (error) {
    console.error('Draft cleanup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = authorizeCron(request)
    if (denied) return denied
    return await cleanupDrafts()
  } catch (error) {
    console.error('Draft cleanup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
