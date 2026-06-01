import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyOtp } from '@/lib/otp'
import { signToken } from '@/lib/auth'

const verifyOtpSchema = z.object({
  phone: z.string().trim().regex(/^\+94\d{9}$/, 'Invalid Sri Lankan phone number'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  otp: z.string().regex(/^\d{6}$/, 'Invalid OTP format'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, email, otp } = verifyOtpSchema.parse(body)
    const otpKey = `${phone}:${email}`

    // Verify OTP using shared store
    const result = verifyOtp(otpKey, otp)

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Get or create user, keeping phone and email on the same account.
    const matchingUsers = await prisma.user.findMany({
      where: { OR: [{ phone }, { email }] },
      include: { profile: true },
    })

    if (matchingUsers.length > 1) {
      return NextResponse.json(
        { error: 'Phone number and email are already linked to different accounts.' },
        { status: 409 }
      )
    }

    let user
    if (matchingUsers.length === 0) {
      user = await prisma.user.create({
        data: { phone, email, isVerified: true },
        include: { profile: true },
      })
    } else {
      user = await prisma.user.update({
        where: { id: matchingUsers[0].id },
        data: { phone, email, isVerified: true },
        include: { profile: true },
      })
    }

    // Generate JWT token using shared auth utility
    const token = signToken({
      userId: user.id,
      phone: user.phone,
      email: user.email,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
    })

    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
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
        { error: error.errors[0].message },
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
