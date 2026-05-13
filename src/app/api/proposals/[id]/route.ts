import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock proposal data for development
const mockProposals: Record<string, any> = {
  '1': {
    id: '1',
    firstName: 'Anusha',
    lastName: 'Perera',
    age: 28,
    gender: 'female',
    location: 'Colombo',
    job: 'Software Engineer',
    education: 'BSc Computer Science',
    height: '5 feet 4 inches',
    religion: 'Buddhism',
    caste: 'Sinhala',
    motherTongue: 'Sinhala',
    description: 'Looking for a caring and understanding life partner who values family and career. I enjoy reading, traveling, and cooking in my free time.',
    avatar: null,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  '2': {
    id: '2',
    firstName: 'Ravindra',
    lastName: 'Silva',
    age: 32,
    gender: 'male',
    location: 'Kandy',
    job: 'Bank Manager',
    education: 'MBA',
    height: '5 feet 8 inches',
    religion: 'Buddhism',
    caste: 'Sinhala',
    motherTongue: 'Sinhala',
    description: 'Seeking a compatible partner for marriage. I am family-oriented and looking for someone with similar values.',
    avatar: null,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  '3': {
    id: '3',
    firstName: 'Nadeesha',
    lastName: 'Fernando',
    age: 26,
    gender: 'female',
    location: 'Galle',
    job: 'Teacher',
    education: 'BSc Education',
    height: '5 feet 2 inches',
    religion: 'Christianity',
    caste: 'Sinhala',
    motherTongue: 'Sinhala',
    description: 'Family-oriented person looking for a life partner who is understanding and supportive.',
    avatar: null,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  '4': {
    id: '4',
    firstName: 'Chamara',
    lastName: 'Rajapaksha',
    age: 30,
    gender: 'male',
    location: 'Matara',
    job: 'Doctor',
    education: 'MBBS',
    height: '5 feet 10 inches',
    religion: 'Buddhism',
    caste: 'Sinhala',
    motherTongue: 'Sinhala',
    description: 'Looking for a loving and supportive partner to build a happy life together.',
    avatar: null,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      const proposal = mockProposals[id]
      
      if (!proposal) {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ proposal })
    }

    // Production query with Prisma
    const proposal = await prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            isVerified: true,
            createdAt: true,
          },
        },
      },
    })

    if (!proposal || !proposal.isActive) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ proposal })

  } catch (error) {
    console.error('Get proposal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
