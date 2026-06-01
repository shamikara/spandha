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

    // Find the advert and verify ownership
    const advert = await prisma.advert.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
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

    if (advert.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete the advert
    await prisma.advert.delete({
      where: { id },
    })

    // In production, you would:
    // 1. Log the deletion
    // 2. Update analytics
    // 3. Send confirmation notification

    console.log(`Advert ${id} deleted by user ${user.userId}`)

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
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean' },
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

    // Update advert status
    const updatedAdvert = await prisma.advert.update({
      where: { id },
      data: { isActive },
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
      message: `Advert ${isActive ? 'activated' : 'deactivated'} successfully`,
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
