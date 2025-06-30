import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    // Get auth token from cookie
    const token = request.cookies.get('auth_token');
    const { pathname } = request.nextUrl;

    // Define protected and auth routes
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
    const isAdminRoute = pathname.startsWith('/admin');
    const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(pathname);

    // Redirect logic for protected routes
    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // For admin routes, we'll let the client-side AdminGuard handle the admin check
    // since we can't verify admin status in middleware without making database calls

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password'
  ]
};