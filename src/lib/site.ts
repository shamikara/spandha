const DEFAULT_SITE_URL = 'https://spandha.lk'

/** Canonical site origin (no trailing slash). */
export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    DEFAULT_SITE_URL

  return url.replace(/\/$/, '')
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl())
}
