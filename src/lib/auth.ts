import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  userId: string
  phone: string | null
  email?: string | null
  isVerified: boolean
  isAdmin: boolean
}

/**
 * Returns the JWT_SECRET or throws if it's not configured.
 * This ensures we never silently fall back to an insecure default.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is not set. ' +
      'Set it in your .env.local file before running the application.'
    )
  }
  return secret
}

/**
 * Verifies the JWT auth token from the request cookies (API / Middleware).
 * Returns the decoded user payload, or null if invalid/missing.
 */
export function verifyToken(request: NextRequest): AuthUser | null {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthUser
    return decoded
  } catch {
    return null
  }
}

/**
 * Verifies the JWT auth token for Server Components.
 * Returns the decoded user payload, or null if invalid/missing.
 */
export function verifyTokenServer(): AuthUser | null {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthUser
    return decoded
  } catch {
    return null
  }
}

/**
 * Signs a JWT token for the given user payload.
 */
export function signToken(payload: AuthUser): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' })
}
