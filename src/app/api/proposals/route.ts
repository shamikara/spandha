import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const gender = searchParams.get('gender')
    const location = searchParams.get('location')
    const minAge = searchParams.get('minAge')
    const maxAge = searchParams.get('maxAge')

    // Query with Prisma
    const where: any = {
      isActive: true,
      user: {
        isVerified: true,
      },
    }

    if (gender) {
      where.gender = gender
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      }
    }

    if (minAge || maxAge) {
      where.age = {}
      if (minAge) where.age.gte = parseInt(minAge)
      if (maxAge) where.age.lte = parseInt(maxAge)
    }

    const [proposals, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        include: {
          user: {
            select: {
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.profile.count({ where }),
    ])

    return NextResponse.json({
      proposals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Get proposals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
