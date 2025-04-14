import { events } from '@/lib/data/events';
import { Metadata } from 'next';
import EventDetailClient from '@/components/events/EventDetailClient';

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const event = events.find(e => e.id === parseInt(params.id));

  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.'
    };
  }

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

export function generateStaticParams() {
  return events.map((event) => ({
    id: event.id.toString(),
  }));
}

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

import { isAuthenticated } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';

export default async function EventPage(props: Props) {
  if (!isAuthenticated()) {
    redirect('/register?message=Please sign up to join this event');
  }

  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const { id } = params;
  const event = events.find(e => e.id === parseInt(id));

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center">Event not found</h1>
      </div>
    );
  }

  return <EventDetailClient event={event} />;
}
