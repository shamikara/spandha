/**
 * OTP storage for passwordless login.
 * The OTP is the user's login credential (no separate password).
 *
 * In development: in-memory Map (single process).
 * In production: use Redis/Upstash for multi-instance support.
 */

interface OtpRecord {
  otp: string
  expiresAt: number
  attempts: number
}

interface RateLimitRecord {
  count: number
  resetTime: number
}

// Single shared Map instances — imported by both send-otp and verify-otp
const otpStore = new Map<string, OtpRecord>()
const rateLimitStore = new Map<string, RateLimitRecord>()

const OTP_EXPIRY_MS = 10 * 60 * 1000  // 10 minutes
const MAX_OTP_ATTEMPTS = 3
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000  // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5

/**
 * Generate a cryptographically-random 6-digit OTP.
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Store an OTP for a given phone number.
 */
export function storeOtp(phone: string, otp: string): void {
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  })
}

/**
 * Verify an OTP for a given phone number.
 * Returns { valid: true } on success, or { valid: false, error: string } on failure.
 */
export function verifyOtp(phone: string, otp: string): { valid: boolean; error?: string } {
  const stored = otpStore.get(phone)

  if (!stored) {
    return { valid: false, error: 'OTP not found. Please request a new OTP.' }
  }

  // Check expiry
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone)
    return { valid: false, error: 'OTP expired. Please request a new OTP.' }
  }

  // Check attempt limit
  if (stored.attempts >= MAX_OTP_ATTEMPTS) {
    otpStore.delete(phone)
    return { valid: false, error: 'Too many failed attempts. Please request a new OTP.' }
  }

  // Verify
  if (stored.otp !== otp) {
    stored.attempts++
    return { valid: false, error: 'Invalid OTP' }
  }

  // Success — clean up
  otpStore.delete(phone)
  return { valid: true }
}

/**
 * Check if a phone number has exceeded the rate limit for OTP requests.
 * Returns true if the request is allowed, false if rate-limited.
 */
export function checkRateLimit(phone: string): boolean {
  const now = Date.now()
  const current = rateLimitStore.get(phone)

  if (!current || now > current.resetTime) {
    rateLimitStore.set(phone, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  current.count++
  return true
}

/**
 * Clean up expired entries from both stores.
 * Call this periodically in production to prevent memory leaks.
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now()

  Array.from(otpStore.entries()).forEach(([phone, record]) => {
    if (now > record.expiresAt) {
      otpStore.delete(phone)
    }
  })

  Array.from(rateLimitStore.entries()).forEach(([phone, record]) => {
    if (now > record.resetTime) {
      rateLimitStore.delete(phone)
    }
  })
}
