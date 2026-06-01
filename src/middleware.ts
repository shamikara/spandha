import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/profile', '/post', '/dashboard', '/admin']

// Routes that are only accessible when NOT authenticated
const authRoutes = ['/auth']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // 1. Check if the user is trying to access a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/auth', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Check if the user is trying to access an auth route while already logged in
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isAuthRoute && token) {
    // Redirect to dashboard if already authenticated
    const profileUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(profileUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to all routes except static files, images, and api routes
  // API routes have their own auth checks
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|api).*)'],
}
