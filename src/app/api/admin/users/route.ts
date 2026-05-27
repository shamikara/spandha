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

    // Build the query
    let whereClause: any = {}
    
    if (search) {
      whereClause = {
        OR: [
          { phone: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { profile: { firstName: { contains: search, mode: 'insensitive' } } },
          { profile: { lastName: { contains: search, mode: 'insensitive' } } },
        ]
      }
    }

    if (filter === 'verified') whereClause.isVerified = true
    if (filter === 'unverified') whereClause.isVerified = false
    if (filter === 'premium') whereClause.isPremium = true
    if (filter === 'admin') whereClause.isAdmin = true

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit for now, can implement cursor pagination later
    })

    return NextResponse.json({ users })

  } catch (error) {
    console.error('Fetch users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
