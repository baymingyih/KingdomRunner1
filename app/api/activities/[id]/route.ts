import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase/admin';

export async function PATCH(request: NextRequest) {
  // Extract the 'id' from the request URL
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/');
  const id = segments[segments.length - 1]; // Get last segment as ID
  try {
    // Get the request body
    const body = await request.json();
    const { notes, images } = body;

    // Get the activity document
    const activityRef = adminFirestore.collection('activities').doc(id);
    const activityDoc = await activityRef.get();

    // Check if activity exists
    if (!activityDoc.exists) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: Record<string, any> = {};
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    
    if (images !== undefined) {
      updateData.images = images;
    }

    // Update the activity
    await activityRef.update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}
