'use client';

import { CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEvents } from '@/lib/db/events';
import { Event } from '@/lib/data/events';

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center my-12">Loading events...</div>;
  if (error) return <div className="text-center my-12 text-red-500">{error}</div>;
  if (events.length === 0) return <div className="text-center my-12">No events found</div>;

  return (
    <section className="my-16">
      <h2 className="text-4xl font-bold text-center mb-10 text-primary">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <Card key={event.id} className="h-full flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="p-0">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardTitle className="px-6 pt-4 text-xl">{event.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow px-6 pb-4">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </span>
              </div>
              <p className="mb-4 line-clamp-3 text-gray-700 dark:text-gray-300">{event.description}</p>
              <Button className="w-full mt-auto" size="lg">
                <Link href={`/events/${event.id}`} className="w-full h-full flex items-center justify-center">
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
