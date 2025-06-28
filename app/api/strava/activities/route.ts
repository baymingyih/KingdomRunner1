import { NextResponse } from 'next/server';
import { fetchStravaActivities, StravaError } from '@/lib/strava';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const perPage = searchParams.get('per_page');
    const before = searchParams.get('before');
    const after = searchParams.get('after');

    // Get user ID from query params or cookie
    const userId = searchParams.get('userId');
    let finalUserId = userId;
    
    if (!finalUserId) {
      // Fall back to cookie if not in query params
      const cookieHeader = request.headers.get('cookie') || '';
      const userIdMatch = cookieHeader.match(/user_id=([^;]+)/);
      if (userIdMatch) {
        finalUserId = decodeURIComponent(userIdMatch[1]);
      }
    }
    
    if (!finalUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build params object for fetchStravaActivities
    const params: Record<string, number> = {};
    if (page) params.page = parseInt(page);
    if (perPage) params.per_page = parseInt(perPage);
    if (before) params.before = parseInt(before);
    if (after) params.after = parseInt(after);

    const activities = await fetchStravaActivities(finalUserId, params);
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Activities endpoint error:', error);

    if (error instanceof StravaError) {
      switch (error.code) {
        case 'NOT_AUTHENTICATED':
          return NextResponse.json(
            { error: 'Please connect your Strava account first' },
            { status: 401 }
          );
        case 'TOKEN_REFRESH_ERROR':
          return NextResponse.json(
            { error: 'Your Strava connection needs to be renewed' },
            { status: 401 }
          );
        default:
          return NextResponse.json(
            { error: error.message },
            { status: error.status || 500 }
          );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
