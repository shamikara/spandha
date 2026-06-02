import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { InterestStatus } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { notifyUser } from '@/lib/services/notifications'
import { emailService } from '@/lib/services/notification'

export const dynamic = 'force-dynamic'

const interestSchema = z.object({
  toUserId: z.string().min(1, 'Target user ID is required'),
})

const updateInterestSchema = z.object({
  interestId: z.string().min(1, 'Interest ID is required'),
  status: z.enum(['accepted', 'rejected']),
})

function toInterestStatus(status: z.infer<typeof updateInterestSchema>['status']): InterestStatus {
  return status === 'accepted' ? InterestStatus.ACCEPTED : InterestStatus.REJECTED
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

    // Verification gating: check if user is verified
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { isVerified: true },
    })

    if (!currentUser || !currentUser.isVerified) {
      return NextResponse.json(
        { error: 'You must verify your NIC before sending interests. Please upload your NIC documents and wait for admin verification.' },
        { status: 403 }
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
        status: InterestStatus.PENDING,
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

    const senderName = interest.fromUser.profile
      ? `${interest.fromUser.profile.firstName} ${interest.fromUser.profile.lastName}`
      : 'Someone'

    await notifyUser({
      userId: toUserId,
      type: 'INTEREST_RECEIVED',
      title: 'New interest received',
      message: `${senderName} is interested in your profile.`,
      link: '/dashboard/interests',
    })

    // Send email notification if target user has email
    if (targetUser.email) {
      const interestHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #722f37;">New Interest Received!</h2>
          <p>Dear ${targetUser.profile?.firstName || 'Member'},</p>
          <p>You have received a new interest from <strong>${senderName}</strong>.</p>
          <p>Login to your Spandha dashboard to view and respond to this interest.</p>
          <p>Best regards,<br>Team Spandha</p>
        </div>
      `
      await emailService.sendEmail(
        targetUser.email,
        'New Interest Received on Spandha',
        interestHtml
      )
    }

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
    const { interestId, status } = updateInterestSchema.parse(body)

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
      data: { status: toInterestStatus(status) },
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

    const receiverName = updatedInterest.toUser.profile
      ? `${updatedInterest.toUser.profile.firstName} ${updatedInterest.toUser.profile.lastName}`
      : 'A member'

    await notifyUser({
      userId: updatedInterest.fromUserId,
      type: status === 'accepted' ? 'INTEREST_ACCEPTED' : 'INTEREST_REJECTED',
      title: status === 'accepted' ? 'Interest accepted' : 'Interest declined',
      message: `${receiverName} ${status === 'accepted' ? 'accepted' : 'declined'} your interest.`,
      link: '/dashboard/interests',
    })

    console.log(`Interest ${interestId} updated to ${status} by user ${user.userId}`)

    return NextResponse.json({
      message: `Interest ${status} successfully`,
      interest: updatedInterest,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update interest error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
