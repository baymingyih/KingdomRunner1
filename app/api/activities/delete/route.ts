import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { adminFirestore } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { activityId, token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify the user has permission to delete this activity
    const user = await adminAuth.verifyIdToken(token);
    const activityDoc = await adminFirestore.collection('activities').doc(activityId).get();
    const activityData = activityDoc.data();
    
    if (!activityData) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    if (activityData.userId !== user.uid) {
      return NextResponse.json(
        { error: 'You can only delete your own activities' },
        { status: 403 }
      );
    }

    await adminFirestore.collection('activities').doc(activityId).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
}
