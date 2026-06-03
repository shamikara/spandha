import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Query with Prisma
    const proposal = await prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            isVerified: true,
            isNicVerified: true,
            createdAt: true,
          },
        },
      },
    })

    if (!proposal || !proposal.isActive) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ proposal })

  } catch (error) {
    console.error('Get proposal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
