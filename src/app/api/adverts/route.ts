import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { notifyUser } from '@/lib/services/notifications'

export const dynamic = 'force-dynamic'

const advertSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters').max(1000, 'Content must be less than 1000 characters'),
  builderData: z.record(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const active = searchParams.get('active')

    const where: any = {
      userId: user.userId,
    }

    if (active !== null) {
      where.isActive = active === 'true'
    }

    const [adverts, total] = await Promise.all([
      prisma.advert.findMany({
        where,
        include: {
          user: {
            select: {
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
    console.error('Get adverts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = advertSchema.parse(body)

    // Check if user has a profile
    const userProfile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: 'Please create a profile first before posting adverts' },
        { status: 400 }
      )
    }

    // Check if user has too many active adverts
    const activeAdvertsCount = await prisma.advert.count({
      where: {
        userId: user.userId,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (activeAdvertsCount >= 3) {
      return NextResponse.json(
        { error: 'You can have maximum 3 active adverts at a time' },
        { status: 400 }
      )
    }

    // Create advert
    const advert = await prisma.advert.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        builderData: validatedData.builderData,
        userId: user.userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      include: {
        user: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    await notifyUser({
      userId: user.userId,
      type: 'ADVERT_CREATED',
      title: 'Advert posted',
      message: `Your advert "${advert.title}" has been posted and is visible while active.`,
      link: '/dashboard/adverts',
    })

    console.log(`New advert created by user ${user.userId}`)

    return NextResponse.json({
      message: 'Advert created successfully',
      advert,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create advert error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
