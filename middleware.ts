import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    // Get auth token from cookie
    const token = request.cookies.get('auth_token');
    const { pathname } = request.nextUrl;

    // Define protected and auth routes
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(pathname);

    // Redirect logic
    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Removed automatic redirect from auth routes to dashboard
    // Users can now stay on login page after signing in

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/forgot-password'
  ]
};
