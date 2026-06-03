import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')

    const adverts = await prisma.advert.findMany({
      where: {
        isPublished: true,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
        user: {
          isPremium: true,
          isNicVerified: true,
        },
      },
      include: {
        user: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
                age: true,
                location: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json({ adverts })
  } catch (error) {
    console.error('Get premium adverts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
