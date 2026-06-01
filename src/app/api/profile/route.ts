import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Gender } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  age: z.number().min(18, 'Must be at least 18 years old').max(100, 'Invalid age'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
  location: z.string().min(2, 'Location is required'),
  job: z.string().optional(),
  education: z.string().optional(),
  height: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  motherTongue: z.string().optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
})

function toGender(value: z.infer<typeof profileSchema>['gender']): Gender {
  return value === 'male' ? Gender.MALE : Gender.FEMALE
}

function toProfileData(validatedData: z.infer<typeof profileSchema>) {
  return {
    ...validatedData,
    gender: toGender(validatedData.gender),
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
      include: {
        user: {
          select: {
            phone: true,
            email: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = profileSchema.parse(body)

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      )
    }

    const profile = await prisma.profile.create({
      data: {
        ...toProfileData(validatedData),
        userId: user.userId,
      },
      include: {
        user: {
          select: {
            phone: true,
            email: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Profile created successfully',
      profile,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = verifyToken(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = profileSchema.parse(body)

    const profile = await prisma.profile.update({
      where: { userId: user.userId },
      data: toProfileData(validatedData),
      include: {
        user: {
          select: {
            phone: true,
            email: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
