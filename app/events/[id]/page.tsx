import { Metadata } from 'next';
import EventDetailClient from '@/components/events/EventDetailClient';
import { adminFirestore } from '@/lib/firebase/admin';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface PrayerGuide {
  day: number;
  title: string;
  verse: string;
  prayer: string;
}

interface Runner {
  id: number;
  name: string;
  country: string;
  distance: number;
  prayers: number;
}

interface Prayer {
  id: number;
  runner: string;
  content: string;
  timestamp: string;
}

interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  image: string;
  theme: string;
  participants: number;
  prayerGuide: PrayerGuide[];
  leaderboard: Runner[];
  prayers: Prayer[];
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const doc = await adminFirestore.collection('events').doc(params.id).get();
  
  if (!doc.exists) {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.'
    };
  }

  const event = {
    id: doc.id,
    name: doc.data()?.name || '',
    startDate: typeof doc.data()?.startDate === 'string' ? doc.data()?.startDate.split('T')[0] 
             : doc.data()?.startDate?.toDate?.().toISOString().split('T')[0] 
             || new Date().toISOString().split('T')[0],
    endDate: typeof doc.data()?.endDate === 'string' ? doc.data()?.endDate.split('T')[0]
           : doc.data()?.endDate?.toDate?.().toISOString().split('T')[0]
           || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: doc.data()?.description || '',
    image: doc.data()?.image || '/default-event.jpg',
    theme: doc.data()?.theme || '',
    participants: doc.data()?.participants || 0,
    prayerGuide: doc.data()?.prayerGuide || [],
    leaderboard: doc.data()?.leaderboard || [],
    prayers: doc.data()?.prayers || []
  } as Event;

  return {
    title: `${event.name} - Kingdom Runners`,
    description: event.description,
    openGraph: {
      title: event.name,
      description: event.description,
      images: [event.image],
    },
  };
}

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function EventPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const { id } = params;
  const doc = await adminFirestore.collection('events').doc(id).get();
  
  if (!doc.exists) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center">Event not found</h1>
      </div>
    );
  }

  const event = {
    id: doc.id,
    name: doc.data()?.name || '',
    startDate: typeof doc.data()?.startDate === 'string' ? doc.data()?.startDate.split('T')[0] 
             : doc.data()?.startDate?.toDate?.().toISOString().split('T')[0] 
             || new Date().toISOString().split('T')[0],
    endDate: typeof doc.data()?.endDate === 'string' ? doc.data()?.endDate.split('T')[0]
           : doc.data()?.endDate?.toDate?.().toISOString().split('T')[0]
           || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: doc.data()?.description || '',
    image: doc.data()?.image || '/default-event.jpg',
    theme: doc.data()?.theme || '',
    participants: doc.data()?.participants || 0,
    prayerGuide: doc.data()?.prayerGuide || [],
    leaderboard: doc.data()?.leaderboard || [],
    prayers: doc.data()?.prayers || []
  } as Event;

  const cookieStore = await cookies();
  if (!cookieStore.get('auth_token')?.value) {
    redirect('/register?message=Please sign up to join this event');
  }

  return <EventDetailClient event={event} />;
}
