import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Verify this is an internal request (could add auth token check)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete drafts inactive for more than 21 days
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
  } catch (error) {
    console.error('Draft cleanup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
