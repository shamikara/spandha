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
  isPublished: z.boolean().optional(),
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

    // Verification gating: check if user is NIC verified
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { isNicVerified: true, isPremium: true },
    })

    if (!currentUser || !currentUser.isNicVerified) {
      return NextResponse.json(
        { error: 'You must verify your NIC before posting adverts. Please upload your NIC documents and wait for admin verification.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = advertSchema.parse(body)
    const isPublished = validatedData.isPublished !== false // Default to true

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

    if (isPublished) {
      // Check published limits
      const activeAdvertsCount = await prisma.advert.count({
        where: {
          userId: user.userId,
          isPublished: true,
          isActive: true,
          expiresAt: {
            gt: new Date(),
          },
        },
      })

      if (currentUser.isPremium) {
        // Premium users: up to 5 active published adverts
        if (activeAdvertsCount >= 5) {
          return NextResponse.json(
            { error: 'Premium users can have maximum 5 active published adverts at a time' },
            { status: 400 }
          )
        }
      } else {
        // Free users: 1 advert per 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const recentAdvert = await prisma.advert.findFirst({
          where: {
            userId: user.userId,
            isPublished: true,
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
          orderBy: { createdAt: 'desc' },
        })

        if (recentAdvert) {
          const nextAvailableDate = new Date(recentAdvert.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
          return NextResponse.json(
            {
              error: 'You can post one advert per month. Your next post will be available on ' + nextAvailableDate.toLocaleDateString(),
            },
            { status: 400 }
          )
        }

        // Also check if they already have 1 active published advert
        if (activeAdvertsCount >= 1) {
          return NextResponse.json(
            { error: 'Free users can have maximum 1 active published advert at a time' },
            { status: 400 }
          )
        }
      }
    } else {
      // Check draft limits
      const draftCount = await prisma.advert.count({
        where: {
          userId: user.userId,
          isPublished: false,
        },
      })

      const maxDrafts = currentUser.isPremium ? 10 : 3

      if (draftCount >= maxDrafts) {
        return NextResponse.json(
          { error: `You can have maximum ${maxDrafts} drafts. Publish or delete an existing draft first.` },
          { status: 400 }
        )
      }
    }

    // Create advert
    const advert = await prisma.advert.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        builderData: validatedData.builderData,
        isPublished,
        userId: user.userId,
        expiresAt: isPublished ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null, // 30 days from now for published only
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

    if (isPublished) {
      await notifyUser({
        userId: user.userId,
        type: 'ADVERT_CREATED',
        title: 'Advert posted',
        message: `Your advert "${advert.title}" has been posted and is visible while active.`,
        link: '/dashboard/adverts',
      })
    }

    console.log(`New ${isPublished ? 'published advert' : 'draft'} created by user ${user.userId}`)

    return NextResponse.json({
      message: isPublished ? 'Advert created successfully' : 'Draft saved successfully',
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
