import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { isAdmin: true },
    })

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const isPublished = searchParams.get('isPublished')

    const where: any = {}

    if (isPublished !== null) {
      where.isPublished = isPublished === 'true'
    }

    const [adverts, total] = await Promise.all([
      prisma.advert.findMany({
        where,
        include: {
          user: {
            select: {
              phone: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.advert.count({ where }),
    ])

    return NextResponse.json({
      adverts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Get admin adverts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
