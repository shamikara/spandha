import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\+94\d{9}$/, 'Invalid Sri Lankan phone number'),
  otp: z.string().regex(/^\d{6}$/, 'Invalid OTP format'),
})

// Rate limiting store (in production, use Redis)
const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp } = verifyOtpSchema.parse(body)

    // Get stored OTP
    const storedData = otpStore.get(phone)
    
    if (!storedData) {
      return NextResponse.json(
        { error: 'OTP not found. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phone)
      return NextResponse.json(
        { error: 'OTP expired. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(phone)
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts++
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // OTP is valid - clean up
    otpStore.delete(phone)

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { phone },
      include: { profile: true },
    })

    if (!user) {
      user = await prisma.user.create({
        where: { phone },
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

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        phone: user.phone, 
        isVerified: user.isVerified 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

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
