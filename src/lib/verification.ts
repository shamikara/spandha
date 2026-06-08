/**
 * Auth & verification model:
 *
 * - **Login (passwordless):** OTP is the credential — there is no separate password.
 *   Successful OTP → user is signed in and `isVerified` = true (phone/email ownership confirmed).
 *
 * - **Identity (NIC):** User uploads NIC → admin approves → `isNicVerified` = true.
 *
 * Feature gates (interests, adverts, public listing) require `isNicVerified`.
 */

export interface VerificationUser {
  isVerified: boolean
  isNicVerified: boolean
}

export interface VerificationProfile {
  nicFront?: string | null
  nicBack?: string | null
}

export function hasNicDocuments(profile?: VerificationProfile | null): boolean {
  return Boolean(profile?.nicFront && profile?.nicBack)
}

/** `isVerified` = signed in via OTP (login credential accepted). */
export function loginStatusLabel(isVerified: boolean): string {
  return isVerified ? 'Signed in (OTP login)' : 'Enter OTP to sign in'
}

export function nicVerificationLabel(user: VerificationUser, profile?: VerificationProfile | null): string {
  if (user.isNicVerified) return 'Identity verified by admin'
  if (hasNicDocuments(profile)) return 'NIC uploaded — awaiting admin review'
  return 'NIC not uploaded yet'
}

export function canUseVerifiedFeatures(user: VerificationUser): boolean {
  return user.isNicVerified
}

/** @deprecated Use loginStatusLabel */
export function accountVerificationLabel(isVerified: boolean): string {
  return loginStatusLabel(isVerified)
}
