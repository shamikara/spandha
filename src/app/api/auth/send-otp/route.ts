import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const sendOtpSchema = z.object({
  phone: z.string().regex(/^\+94\d{9}$/, 'Invalid Sri Lankan phone number'),
})

// Rate limiting store (in production, use Redis)
const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>()
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function checkRateLimit(phone: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5

  const current = rateLimitStore.get(phone)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(phone, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = sendOtpSchema.parse(body)

    // Rate limiting
    if (!checkRateLimit(phone)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP (in production, use Redis)
    otpStore.set(phone, { otp, expiresAt, attempts: 0 })

    // Mock SMS sending - in production, use actual SMS service
    console.log(`Mock OTP for ${phone}: ${otp}`)

    // Create or update user (with fallback for development)
    try {
      await prisma.user.upsert({
        where: { phone },
        update: {},
        create: { phone },
      })
    } catch (dbError) {
      // In development without database, just log and continue
      if (process.env.NODE_ENV === 'development') {
        console.log('Database not available, continuing with mock data')
      } else {
        throw dbError
      }
    }

    return NextResponse.json({
      message: 'OTP sent successfully',
      // For development, return the OTP (remove in production)
      ...(process.env.NODE_ENV === 'development' && { otp }),
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
