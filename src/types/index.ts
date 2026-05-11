import { Gender, InterestStatus, BlockType, Locale } from '@prisma/client'

// Use these shared types throughout the frontend instead of generic `any`

export interface User {
  id: string
  phone: string
  email: string | null
  isVerified: boolean
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
  profile?: Profile | null
}

export interface Profile {
  id: string
  userId: string
  firstName: string
  lastName: string
  age: number
  gender: Gender
  location: string
  job: string | null
  education: string | null
  height: string | null
  religion: string | null
  caste: string | null
  motherTongue: string | null
  description: string | null
  avatar: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Interest {
  id: string
  fromUserId: string
  toUserId: string
  status: InterestStatus
  createdAt: Date
  updatedAt: Date
  fromUser?: { profile: Profile | null }
  toUser?: { profile: Profile | null }
}

export interface Advert {
  id: string
  userId: string
  title: string
  content: string
  builderData: any | null // JSON
  isActive: boolean
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
  user?: { profile: { firstName: string, lastName: string } | null }
}

export interface ContentBlock {
  id: string
  key: string
  locale: Locale
  type: BlockType
  content: any // Parsed JSON
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProposalsResponse {
  proposals: (Profile & { user?: { phone: string, createdAt: Date } })[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: string
}
