import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyOtp } from '@/lib/otp'
import { signToken } from '@/lib/auth'

const verifyOtpSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or phone number is required'),
  otp: z.string().regex(/^\d{6}$/, 'Invalid OTP format'),
})

function parseIdentifier(identifier: string) {
  const value = identifier.trim()
  const emailResult = z.string().email().safeParse(value.toLowerCase())

  if (emailResult.success) {
    return { email: emailResult.data, phone: null }
  }

  const phoneResult = z.string().regex(/^\+94\d{9}$/).safeParse(value)

  if (phoneResult.success) {
    return { phone: phoneResult.data, email: null }
  }

  throw new z.ZodError([
    {
      code: z.ZodIssueCode.custom,
      message: 'Enter a valid email address or Sri Lankan phone number',
      path: ['identifier'],
    },
  ])
}

function otpKey(identifier: string) {
  return `login:${identifier}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, otp } = verifyOtpSchema.parse(body)
    const parsed = parseIdentifier(identifier)
    const normalizedIdentifier = parsed.email || parsed.phone

    if (!normalizedIdentifier) {
      return NextResponse.json({ error: 'Email or phone number is required' }, { status: 400 })
    }

    // Verify OTP using shared store
    const result = verifyOtp(otpKey(normalizedIdentifier), otp)

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Get or create user by the single login identifier.
    const existingUser = await prisma.user.findFirst({
      where: parsed.phone ? { phone: parsed.phone } : { email: parsed.email as string },
      include: { profile: true },
    })

    let user
    if (!existingUser) {
      user = await prisma.user.create({
        data: parsed.phone
          ? { phone: parsed.phone, isVerified: true }
          : { email: parsed.email, isVerified: true },
        include: { profile: true },
      })
    } else {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: { isVerified: true },
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
        isNicVerified: user.isNicVerified,
        isAdmin: user.isAdmin,
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
