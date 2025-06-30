import { NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/lib/firebase/admin';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Verify authentication
    const headersList = await headers();
    const authHeader = headersList.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Get user data to check admin status
    const user = await adminFirestore.collection('users').doc(decodedToken.uid).get();
    const userData = user.data();
    
    if (!userData?.isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const eventData = await request.json();

    // Create the event using admin SDK
    const docRef = await adminFirestore.collection('events').add({
      name: eventData.name,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      theme: eventData.theme || '',
      description: eventData.description || '',
      image: eventData.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      participants: 0,
      prayerGuide: [],
      leaderboard: [],
      prayers: [],
      recentRuns: []
    });

    // Get the created document
    const doc = await docRef.get();
    
    return NextResponse.json({ 
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
