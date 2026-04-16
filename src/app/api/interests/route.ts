import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const interestSchema = z.object({
  toUserId: z.string().min(1, 'Target user ID is required'),
})

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    return decoded
  } catch (error) {
    return null
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
    const { toUserId } = interestSchema.parse(body)

    // Check if user is trying to send interest to themselves
    if (user.userId === toUserId) {
      return NextResponse.json(
        { error: 'Cannot send interest to yourself' },
        { status: 400 }
      )
    }

    // Check if target user exists and has an active profile
    const targetUser = await prisma.user.findUnique({
      where: { id: toUserId },
      include: { profile: true },
    })

    if (!targetUser || !targetUser.profile || !targetUser.profile.isActive) {
      return NextResponse.json(
        { error: 'Target user not found or profile not active' },
        { status: 404 }
      )
    }

    // Check if interest already exists
    const existingInterest = await prisma.interest.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: user.userId,
          toUserId: toUserId,
        },
      },
    })

    if (existingInterest) {
      return NextResponse.json(
        { error: 'Interest already sent' },
        { status: 400 }
      )
    }

    // Create new interest
    const interest = await prisma.interest.create({
      data: {
        fromUserId: user.userId,
        toUserId: toUserId,
        status: 'pending',
      },
      include: {
        fromUser: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        toUser: {
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

    // In production, you would:
    // 1. Send notification to the target user
    // 2. Send email notification
    // 3. Create activity log
    // 4. Update analytics

    console.log(`New interest sent from ${user.userId} to ${toUserId}`)

    return NextResponse.json({
      message: 'Interest sent successfully',
      interest,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Send interest error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const type = searchParams.get('type') // 'sent' or 'received'

    let interests

    if (type === 'sent') {
      interests = await prisma.interest.findMany({
        where: { fromUserId: user.userId },
        include: {
          toUser: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else if (type === 'received') {
      interests = await prisma.interest.findMany({
        where: { toUserId: user.userId },
        include: {
          fromUser: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      // Return all interests for the user
      const [sentInterests, receivedInterests] = await Promise.all([
        prisma.interest.findMany({
          where: { fromUserId: user.userId },
          include: {
            toUser: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.interest.findMany({
          where: { toUserId: user.userId },
          include: {
            fromUser: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
      ])

      return NextResponse.json({
        sent: sentInterests,
        received: receivedInterests,
      })
    }

    return NextResponse.json({ interests })

  } catch (error) {
    console.error('Get interests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = verifyToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { interestId, status } = body

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Find the interest and verify it belongs to the user (as receiver)
    const interest = await prisma.interest.findUnique({
      where: { id: interestId },
      include: {
        fromUser: true,
        toUser: true,
      },
    })

    if (!interest) {
      return NextResponse.json(
        { error: 'Interest not found' },
        { status: 404 }
      )
    }

    if (interest.toUserId !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update interest status
    const updatedInterest = await prisma.interest.update({
      where: { id: interestId },
      data: { status },
      include: {
        fromUser: {
          include: {
            profile: true,
          },
        },
        toUser: {
          include: {
            profile: true,
          },
        },
      },
    })

    // In production, you would:
    // 1. Send notification to the sender about the status change
    // 2. Send email notification
    // 3. Create activity log
    // 4. If accepted, enable messaging between users

    console.log(`Interest ${interestId} updated to ${status} by user ${user.userId}`)

    return NextResponse.json({
      message: `Interest ${status} successfully`,
      interest: updatedInterest,
    })

  } catch (error) {
    console.error('Update interest error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
