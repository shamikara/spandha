import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = contactSchema.parse(body)

    // In production, you would:
    // 1. Send email using a service like SendGrid, Nodemailer, or AWS SES
    // 2. Store the contact in a database
    // 3. Set up notifications for the admin team

    console.log('Contact form submission:', { name, email, subject, message })

    // Mock email sending for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`
        New Contact Form Submission:
        
        From: ${name} <${email}>
        Subject: ${subject}
        
        Message:
        ${message}
      `)
    }

    return NextResponse.json({
      message: 'Contact form submitted successfully',
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
