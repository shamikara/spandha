import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Mock data for development
const mockProposals = [
  {
    id: '1',
    firstName: 'Anusha',
    lastName: 'Perera',
    age: 28,
    gender: 'female',
    location: 'Colombo',
    job: 'Software Engineer',
    education: 'BSc Computer Science',
    description: 'Looking for a caring and understanding life partner.',
    avatar: null,
    isActive: true,
  },
  {
    id: '2',
    firstName: 'Ravindra',
    lastName: 'Silva',
    age: 32,
    gender: 'male',
    location: 'Kandy',
    job: 'Bank Manager',
    education: 'MBA',
    description: 'Seeking a compatible partner for marriage.',
    avatar: null,
    isActive: true,
  },
  {
    id: '3',
    firstName: 'Nadeesha',
    lastName: 'Fernando',
    age: 26,
    gender: 'female',
    location: 'Galle',
    job: 'Teacher',
    education: 'BSc Education',
    description: 'Family-oriented person looking for a life partner.',
    avatar: null,
    isActive: true,
  },
  {
    id: '4',
    firstName: 'Chamara',
    lastName: 'Rajapaksha',
    age: 30,
    gender: 'male',
    location: 'Matara',
    job: 'Doctor',
    education: 'MBBS',
    description: 'Looking for a loving and supportive partner.',
    avatar: null,
    isActive: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const gender = searchParams.get('gender')
    const location = searchParams.get('location')
    const minAge = searchParams.get('minAge')
    const maxAge = searchParams.get('maxAge')

    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      let filteredProposals = mockProposals

      if (gender) {
        filteredProposals = filteredProposals.filter(p => p.gender === gender)
      }

      if (location) {
        filteredProposals = filteredProposals.filter(p => 
          p.location.toLowerCase().includes(location.toLowerCase())
        )
      }

      if (minAge) {
        filteredProposals = filteredProposals.filter(p => p.age >= parseInt(minAge))
      }

      if (maxAge) {
        filteredProposals = filteredProposals.filter(p => p.age <= parseInt(maxAge))
      }

      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProposals = filteredProposals.slice(startIndex, endIndex)

      return NextResponse.json({
        proposals: paginatedProposals,
        pagination: {
          page,
          limit,
          total: filteredProposals.length,
          totalPages: Math.ceil(filteredProposals.length / limit),
        },
      })
    }

    // Production query with Prisma
    const where: any = {
      isActive: true,
      user: {
        isVerified: true,
      },
    }

    if (gender) {
      where.gender = gender
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      }
    }

    if (minAge || maxAge) {
      where.age = {}
      if (minAge) where.age.gte = parseInt(minAge)
      if (maxAge) where.age.lte = parseInt(maxAge)
    }

    const [proposals, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        include: {
          user: {
            select: {
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.profile.count({ where }),
    ])

    return NextResponse.json({
      proposals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Get proposals error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
