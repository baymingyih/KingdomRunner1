import { NextResponse } from 'next/server';
import { getStravaConnectionStatus } from '@/lib/strava';

export async function GET(request: Request) {
  try {
    // Get user ID from cookie header
    const cookieHeader = request.headers.get('cookie') || '';
    const userIdMatch = cookieHeader.match(/user_id=([^;]+)/);
    
    if (!userIdMatch) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = decodeURIComponent(userIdMatch[1]);
    const status = await getStravaConnectionStatus(userId);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Status endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to check Strava connection status' },
      { status: 500 }
    );
  }
}
