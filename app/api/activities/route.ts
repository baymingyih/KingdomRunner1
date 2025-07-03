import { NextResponse } from 'next/server';
import { getAllActivities } from '@/lib/db/activities';
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get the session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;

    if (!sessionCookie) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify the session cookie and get the user
    try {
      await adminAuth.verifySessionCookie(sessionCookie);
    } catch (error) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const activities = await getAllActivities();
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
