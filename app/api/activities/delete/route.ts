import { NextResponse } from 'next/server';
import { deleteActivity } from '@/lib/db/activities';
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
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

    // Get the activity ID from the request body
    const { activityId } = await request.json();

    if (!activityId) {
      return new NextResponse('Activity ID is required', { status: 400 });
    }

    // Delete the activity
    await deleteActivity(activityId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
