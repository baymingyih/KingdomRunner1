import { adminFirestore } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';
import { Event } from '@/lib/data/events';

export async function GET() {
  try {
    // Query for active events (where endDate is in future)
    const now = new Date();
    const eventsQuery = adminFirestore.collection('events')
      .where('endDate', '>=', now)
      .orderBy('endDate', 'asc')
      .limit(1);

    const snapshot = await eventsQuery.get();
    
    if (snapshot.empty) {
      // Fallback to most recent event if no active ones
      const allEvents = await adminFirestore.collection('events')
        .orderBy('startDate', 'desc')
        .limit(1)
        .get();

      if (allEvents.empty) {
        return NextResponse.json({ error: 'No events found' }, { status: 404 });
      }
      
      const currentEvent = allEvents.docs[0].data() as Event;
      return NextResponse.json({
        id: allEvents.docs[0].id,
        youtubeUrl: currentEvent.youtubeUrl
      });
    }

    const currentEvent = snapshot.docs[0].data() as Event;

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
