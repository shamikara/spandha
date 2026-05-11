import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Helper to verify admin
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })
    return user?.isAdmin ? user : null
  } catch {
    return null
  }
}

// UPDATE block (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, type, content, isActive } = body

    const updateData: any = {}
    if (key !== undefined) updateData.key = key
    if (type !== undefined) updateData.type = type
    if (content !== undefined) updateData.content = JSON.stringify(content)
    if (isActive !== undefined) updateData.isActive = isActive

    const block = await prisma.contentBlock.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({
      block: {
        ...block,
        content: JSON.parse(block.content),
      },
    })
  } catch (error) {
    console.error('Content block UPDATE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE block (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.contentBlock.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Block deleted successfully' })
  } catch (error) {
    console.error('Content block DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
