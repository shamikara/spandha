import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOTP, storeOtp, checkRateLimit } from '@/lib/otp'
import { smsService, emailService } from '@/lib/services/notification'

const sendOtpSchema = z.object({
  phone: z.string().regex(/^\+94\d{9}$/, 'Invalid Sri Lankan phone number').optional(),
  email: z.string().email('Invalid email address').optional(),
}).refine(data => data.phone || data.email, {
  message: "Either phone or email must be provided",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, email } = sendOtpSchema.parse(body)
    
    const identifier = phone || email
    if (!identifier) {
      return NextResponse.json({ error: 'Identifier required' }, { status: 400 })
    }

    // Rate limiting
    if (!checkRateLimit(identifier)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Generate and store OTP
    const otp = generateOTP()
    storeOtp(identifier, otp)

    // Send OTP via SMS or Email
    let sent = false
    if (phone) {
      sent = await smsService.sendSMS(phone, `Your Spandha verification code is: ${otp}`)
    } else if (email) {
      sent = await emailService.sendEmail(
        email, 
        'Your Spandha Login Code', 
        `<h2>Your verification code is: <strong>${otp}</strong></h2><p>This code will expire in 10 minutes.</p>`
      )
    }

    if (!sent) {
       return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
    }

    // Create or update user
    try {
      if (phone) {
        await prisma.user.upsert({
          where: { phone },
          update: {},
          create: { phone },
        })
      } else if (email) {
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email },
        })
      }
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
        { error: error.errors[0].message },
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
