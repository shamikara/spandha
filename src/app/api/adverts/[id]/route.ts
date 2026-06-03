import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Find the advert
    const advert = await prisma.advert.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            isAdmin: true,
          },
        },
      },
    })

    if (!advert) {
      return NextResponse.json(
        { error: 'Advert not found' },
        { status: 404 }
      )
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { isAdmin: true },
    })

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json(
        { error: 'Please contact admin to request advert deletion.' },
        { status: 403 }
      )
    }

    // Admin can delete any advert
    await prisma.advert.delete({
      where: { id },
    })

    console.log(`Advert ${id} deleted by admin ${user.userId}`)

    return NextResponse.json({
      message: 'Advert deleted successfully',
    })

  } catch (error) {
    console.error('Delete advert error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { isActive, isPublished } = body

    if (typeof isActive !== 'boolean' && typeof isPublished !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive or isPublished must be provided' },
        { status: 400 }
      )
    }

    // Find the advert and verify ownership
    const advert = await prisma.advert.findUnique({
      where: { id },
    })

    if (!advert) {
      return NextResponse.json(
        { error: 'Advert not found' },
        { status: 404 }
      )
    }

    if (advert.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // If publishing a draft, check limits
    if (isPublished === true && advert.isPublished === false) {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { isPremium: true },
      })

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

      if (currentUser?.isPremium) {
        if (activeAdvertsCount >= 5) {
          return NextResponse.json(
            { error: 'Premium users can have maximum 5 active published adverts at a time' },
            { status: 400 }
          )
        }
      } else {
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

        if (activeAdvertsCount >= 1) {
          return NextResponse.json(
            { error: 'Free users can have maximum 1 active published advert at a time' },
            { status: 400 }
          )
        }
      }
    }

    // Build update data
    const updateData: any = {}
    if (typeof isActive === 'boolean') updateData.isActive = isActive
    if (typeof isPublished === 'boolean') {
      updateData.isPublished = isPublished
      // Set expiresAt when publishing, clear when unpublishing
      if (isPublished && !advert.expiresAt) {
        updateData.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    }

    // Update advert
    const updatedAdvert = await prisma.advert.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      message: `Advert updated successfully`,
      advert: updatedAdvert,
    })

  } catch (error) {
    console.error('Update advert error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
