import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authUser = verifyToken(request)
    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all'

    const whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (filter === 'active') whereClause.isActive = true
    if (filter === 'inactive') whereClause.isActive = false

    const profiles = await prisma.profile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            phone: true,
            email: true,
            isVerified: true,
            isNicVerified: true,
            isPremium: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ profiles })
  } catch (error) {
    console.error('Fetch proposals error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
