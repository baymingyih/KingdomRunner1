import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { adminFirestore } from '@/lib/firebase/admin';

interface Event {
  id: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  description: string;
  image: string;
  theme?: string;
  participants?: number;
}

export default async function EventsPage() {
  const eventsSnapshot = await adminFirestore.collection('events').get();
  const events = eventsSnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    startDate: doc.data().startDate,
    endDate: doc.data().endDate,
    description: doc.data().description,
    image: doc.data().image || '/default-event.jpg',
    theme: doc.data().theme,
    participants: doc.data().participants
  } as Event));
  
  if (!events || events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Upcoming Events</h1>
        <p className="text-center">No upcoming events found</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="relative w-full h-64">
              <Image
                src={event.image}
                alt={event.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </p>
              <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                {event.description}
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/events/${event.id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                >
                  Read More
                </Link>
                <Link
                  href={`/events/${event.id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                >
                  Join Event
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
