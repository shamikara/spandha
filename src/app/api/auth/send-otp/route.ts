import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOTP, storeOtp, checkRateLimit } from '@/lib/otp'
import { smsService, emailService } from '@/lib/services/notification'
import { OtpEmail } from '@/emails'

const sendOtpSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or phone number is required'),
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
    const { identifier } = sendOtpSchema.parse(body)
    const parsed = parseIdentifier(identifier)
    const normalizedIdentifier = parsed.email || parsed.phone

    if (!normalizedIdentifier) {
      return NextResponse.json({ error: 'Email or phone number is required' }, { status: 400 })
    }

    // Rate limiting
    if (!checkRateLimit(normalizedIdentifier)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    let deliveryPhone = parsed.phone
    let deliveryEmail = parsed.email

    // Resolve an existing user so one login attempt can send to both saved contacts.
    try {
      const user = await prisma.user.findFirst({
        where: parsed.phone ? { phone: parsed.phone } : { email: parsed.email as string },
        select: { phone: true, email: true },
      })

      if (user) {
        deliveryPhone = user.phone || deliveryPhone
        deliveryEmail = user.email || deliveryEmail
      } else if (parsed.phone) {
        await prisma.user.create({
          data: { phone: parsed.phone },
        })
      } else if (parsed.email) {
        await prisma.user.create({
          data: { email: parsed.email },
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
    storeOtp(otpKey(normalizedIdentifier), otp)

    const deliveries: Promise<boolean>[] = []
    const sentTo: Array<'sms' | 'email'> = []

    if (deliveryPhone) {
      deliveries.push(
        smsService
          .sendSMS(deliveryPhone, `Spandha Login Code: ${otp}. This code expires in 10 minutes. Do not share it with anyone.`)
          .then(sent => {
            if (sent) sentTo.push('sms')
            return sent
          })
      )
    }

    if (deliveryEmail) {
      deliveries.push(
        emailService
          .sendEmail(
            deliveryEmail,
            'Your Spandha Login Code',
            OtpEmail(otp)
          )
          .then(sent => {
            if (sent) sentTo.push('email')
            return sent
          })
      )
    }

    const results = await Promise.all(deliveries)

    if (!results.some(Boolean)) {
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'OTP sent successfully',
      sentTo,
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
