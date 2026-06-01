import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOTP, storeOtp, checkRateLimit } from '@/lib/otp'
import { smsService, emailService } from '@/lib/services/notification'

const sendOtpSchema = z.object({
  phone: z.string().trim().regex(/^\+94\d{9}$/, 'Invalid Sri Lankan phone number'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, email } = sendOtpSchema.parse(body)
    const otpKey = `${phone}:${email}`

    // Rate limiting
    if (!checkRateLimit(phone)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Create or update user before sending the OTP so one account owns both contacts.
    try {
      const matchingUsers = await prisma.user.findMany({
        where: { OR: [{ phone }, { email }] },
        select: { id: true },
      })

      if (matchingUsers.length > 1) {
        return NextResponse.json(
          { error: 'Phone number and email are already linked to different accounts.' },
          { status: 409 }
        )
      }

      if (matchingUsers.length === 1) {
        await prisma.user.update({
          where: { id: matchingUsers[0].id },
          data: { phone, email },
        })
      } else {
        await prisma.user.create({
          data: { phone, email },
        })
      }
    } catch (dbError) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[DEV] Database not available, continuing with mock data')
      } else {
        throw dbError
      }
    }

    // Generate and store OTP
    const otp = generateOTP()
    storeOtp(otpKey, otp)

    // Send the same OTP to both SMS and email. The user can verify with either copy.
    const [smsSent, emailSent] = await Promise.all([
      smsService.sendSMS(phone, `Your Spandha verification code is: ${otp}`),
      emailService.sendEmail(
        email,
        'Your Spandha Login Code',
        `<h2>Your verification code is: <strong>${otp}</strong></h2><p>This code will expire in 10 minutes.</p>`
      ),
    ])

    if (!smsSent && !emailSent) {
       return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
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
