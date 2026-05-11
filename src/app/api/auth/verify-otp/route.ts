import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyOtp } from '@/lib/otp'
import { signToken } from '@/lib/auth'

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\+94\d{9}$/, 'Invalid Sri Lankan phone number'),
  otp: z.string().regex(/^\d{6}$/, 'Invalid OTP format'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp } = verifyOtpSchema.parse(body)

    // Verify OTP using shared store
    const result = verifyOtp(phone, otp)

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { phone },
      include: { profile: true },
    })

    if (!user) {
      user = await prisma.user.create({
        data: { phone, isVerified: true },
        include: { profile: true },
      })
    } else {
      user = await prisma.user.update({
        where: { phone },
        data: { isVerified: true },
        include: { profile: true },
      })
    }

    // Generate JWT token using shared auth utility
    const token = signToken({
      userId: user.id,
      phone: user.phone,
      isVerified: user.isVerified,
    })

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        phone: user.phone,
        isVerified: user.isVerified,
        profile: user.profile,
      },
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      )
    }

    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
