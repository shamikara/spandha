import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = verifyToken(request)

    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Ensure we only update allowed fields
    const allowedFields = ['isNicVerified', 'isPremium', 'isAdmin']
    const updateData: any = {}
    
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
    }

    // Prevent removing admin status from yourself
    if (updateData.isAdmin === false && id === authUser.userId) {
      return NextResponse.json({ error: 'You cannot remove your own admin access' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { profile: true }
    })

    return NextResponse.json({ user: updatedUser })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
