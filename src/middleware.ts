import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Định nghĩa các routes cần authentication
const authRequiredPaths = [
  '/dashboard',
  '/profile',
  '/settings',
  '/transactions',
  '/admin'
]

// Định nghĩa các routes chỉ dành cho admin
const adminOnlyPaths = [
  '/admin'
]

// Định nghĩa các routes chỉ dành cho guest (chưa đăng nhập)
const guestOnlyPaths = [
  '/login',
  '/register',
  '/forgot-password'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Lấy token từ cookies
  const token = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value

  // Check nếu user đã đăng nhập nhưng truy cập guest-only routes
  if (token && guestOnlyPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check nếu route cần authentication
  if (authRequiredPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      // Redirect to login với return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check admin-only routes
    if (adminOnlyPaths.some(path => pathname.startsWith(path))) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}