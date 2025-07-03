import { adminFirestore } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';
import { Event } from '@/lib/data/events';

export async function GET() {
  try {
    // Get all events and find the most recent one
    const eventsSnapshot = await adminFirestore.collection('events').get();
    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];

    // Sort by startDate to get the most recent event
    const currentEvent = events.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0];

    if (!currentEvent) {
      return NextResponse.json({ error: 'No events found' }, { status: 404 });
    }

    return NextResponse.json({
      id: currentEvent.id,
      youtubeUrl: currentEvent.youtubeUrl
    });
  } catch (error) {
    console.error('Error fetching current event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event data' },
      { status: 500 }
    );
  }
}
