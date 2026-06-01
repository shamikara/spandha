import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authUser = verifyToken(request)

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authUser.userId

    const [
      user,
      sentCount,
      receivedCount,
      pendingReceivedCount,
      advertCount,
      activeAdvertCount,
      unreadNotifications,
      notifications,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          phone: true,
          email: true,
          isVerified: true,
          isPremium: true,
          createdAt: true,
          profile: true,
        },
      }),
      prisma.interest.count({ where: { fromUserId: userId } }),
      prisma.interest.count({ where: { toUserId: userId } }),
      prisma.interest.count({ where: { toUserId: userId, status: 'PENDING' } }),
      prisma.advert.count({ where: { userId } }),
      prisma.advert.count({ where: { userId, isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const profileFields = user.profile
      ? [
        user.profile.firstName,
        user.profile.lastName,
        user.profile.age,
        user.profile.gender,
        user.profile.location,
        user.profile.job,
        user.profile.education,
        user.profile.description,
      ]
      : []
    const completedFields = profileFields.filter(Boolean).length
    const profileCompletion = user.profile ? Math.round((completedFields / profileFields.length) * 100) : 0

    return NextResponse.json({
      user,
      stats: {
        profileCompletion,
        sentInterests: sentCount,
        receivedInterests: receivedCount,
        pendingReceivedInterests: pendingReceivedCount,
        adverts: advertCount,
        activeAdverts: activeAdvertCount,
        unreadNotifications,
      },
      notifications,
      payments: {
        isPremium: user.isPremium,
        history: [],
      },
    })
  } catch (error) {
    console.error('Get dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
