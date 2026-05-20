import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = verifyToken(request)
    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [totalUsers, premiumUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isPremium: true } }),
    ])

    const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : '0'

    return NextResponse.json({
      stats: {
        totalUsers,
        premiumUsers,
        conversionRate: `${conversionRate}%`,
      },
    })
  } catch (error) {
    console.error('Fetch revenue error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
