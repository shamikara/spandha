import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOTP, storeOtp, checkRateLimit } from '@/lib/otp'

const sendOtpSchema = z.object({
  phone: z.string().regex(/^\+94\d{9}$/, 'Invalid Sri Lankan phone number'),
})

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

    // Generate and store OTP
    const otp = generateOTP()
    storeOtp(phone, otp)

    // TODO: Phase 4.1 — Replace with real SMS provider (Twilio / Dialog)
    console.log(`[DEV] OTP for ${phone}: ${otp}`)

    // Create or update user
    try {
      await prisma.user.upsert({
        where: { phone },
        update: {},
        create: { phone },
      })
    } catch (dbError) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[DEV] Database not available, continuing with mock data')
      } else {
        throw dbError
      }
    }

    return NextResponse.json({
      message: 'OTP sent successfully'
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
