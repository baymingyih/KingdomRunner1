import { NextResponse } from 'next/server';
import { getStravaAuthUrl } from '@/lib/strava';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get cookies from request headers since cookies() is async
    const cookieHeader = request.headers.get('cookie') || '';
    const userIdMatch = cookieHeader.match(/user_id=([^;]+)/);

    if (!userIdMatch) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = decodeURIComponent(userIdMatch[1]);
    
    // Generate state parameter to prevent CSRF attacks
    const state = Buffer.from(JSON.stringify({
      userId,
      timestamp: Date.now()
    })).toString('base64');

    // Get auth URL with state parameter
    const authUrl = getStravaAuthUrl(state);
    return NextResponse.redirect(authUrl, { status: 302 });
  } catch (error) {
    console.error('Strava auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Strava authentication' },
      { status: 500 }
    );
  }
}
