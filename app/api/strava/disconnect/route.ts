import { NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase/admin';

export async function POST(request: Request) {
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
    
    // Delete Strava tokens from Firestore
    const docRef = adminFirestore.doc(`stravaTokens/${userId}`);
    await docRef.delete();

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Strava disconnected successfully' },
      {
        headers: {
          'Set-Cookie': `strava_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT, user_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT, auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
      }
    );
  } catch (error) {
    console.error('Disconnect endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Strava' },
      { status: 500 }
    );
  }
}
