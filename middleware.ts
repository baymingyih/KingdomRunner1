import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
async function verifyToken(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
import { verifyCsrfToken } from 'lib/auth/csrf';
import rateLimit from 'lib/utils/rateLimit';

// Initialize rate limiter (10 requests per minute)
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function middleware(request: NextRequest) {
  try {
    const { pathname, origin } = request.nextUrl;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';

    // Rate limit all requests
    try {
      await limiter.check(10, ip); // 10 requests per minute
    } catch {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Get auth token from cookie
    const token = request.cookies.get('auth_token')?.value;
    const csrfToken = request.headers.get('x-csrf-token');

    // Define routes
    const isProtectedRoute = [
      '/dashboard',
      '/admin',
      '/api/activities',
      '/api/events'
    ].some(route => pathname.startsWith(route));
    
    const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(pathname);
    const isApiRoute = pathname.startsWith('/api');

    // Verify token for protected routes
    if (isProtectedRoute) {
      if (!token) {
        if (isApiRoute) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', origin));
      }

      try {
        const decodedToken = await verifyToken(token);
        
        // Additional check for admin routes
        if (pathname.startsWith('/admin') && !decodedToken.admin) {
          if (isApiRoute) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
          }
          return NextResponse.redirect(new URL('/dashboard', origin));
        }

        // Verify CSRF token for state-changing requests
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
          if (!csrfToken || !verifyCsrfToken(csrfToken, decodedToken.uid)) {
            return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
          }
        }

        // Add user info to headers for API routes
        if (isApiRoute) {
          const headers = new Headers(request.headers);
          headers.set('x-user-id', decodedToken.uid);
          if (decodedToken.admin) headers.set('x-user-admin', 'true');
          
          return NextResponse.next({ headers });
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        const response = isApiRoute
          ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
          : NextResponse.redirect(new URL('/login', origin));
        
        // Clear invalid token
        response.cookies.delete('auth_token');
        return response;
      }
    }

    // Redirect authenticated users away from auth routes
    if (isAuthRoute && token) {
      return NextResponse.redirect(new URL('/dashboard', origin));
    }

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
    '/forgot-password',
    '/api/:path*'
  ]
};
