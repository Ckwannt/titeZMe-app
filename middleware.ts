import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, {
  count: number
  resetTime: number
}>()

function getRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

function getIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function tooManyRequests() {
  return new NextResponse('Too many requests. Please slow down.', {
    status: 429,
    headers: {
      'Retry-After': '60',
      'Content-Type': 'text/plain'
    }
  })
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const ip = getIP(request)

  // Skip static files completely
  if (
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.includes('.')
  ) {
    return NextResponse.next()
  }

  // Login page: max 10 attempts per 15 minutes
  if (path === '/login') {
    const allowed = getRateLimit(`login:${ip}`, 10, 15 * 60 * 1000)
    if (!allowed) return tooManyRequests()
  }

  // Signup page: max 5 per hour per IP
  if (path === '/signup') {
    const allowed = getRateLimit(`signup:${ip}`, 5, 60 * 60 * 1000)
    if (!allowed) return tooManyRequests()
  }

  // Booking pages: max 20 per hour per IP
  if (path.startsWith('/book/')) {
    const allowed = getRateLimit(`booking:${ip}`, 20, 60 * 60 * 1000)
    if (!allowed) return tooManyRequests()
  }

  // Forgot password: max 5 per hour per IP
  if (path === '/forgot-password') {
    const allowed = getRateLimit(`forgot:${ip}`, 5, 60 * 60 * 1000)
    if (!allowed) return tooManyRequests()
  }

  // Admin login: max 5 per 15 minutes per IP
  if (path === '/admin/login') {
    const allowed = getRateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000)
    if (!allowed) return tooManyRequests()
  }

  // Admin protected routes: max 60 per minute per IP
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const allowed = getRateLimit(`admin:${ip}`, 60, 60 * 1000)
    if (!allowed) return tooManyRequests()
  }

  // General pages: max 300 per minute per IP
  const allowed = getRateLimit(`general:${ip}`, 300, 60 * 1000)
  if (!allowed) return tooManyRequests()

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webp).*)',
  ]
}
