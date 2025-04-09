import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const events = [
  { id: 1, name: "FCA East Global Conference Hong Kong", date: "2023-11-15", theme: "Unity in Diversity", image: "/images/fca-east-global-conference-hong-kong.png" }
];

export default function FeaturedEvents() {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold text-center mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-auto rounded-md mt-2"
                />
              )}
            </CardHeader>
            <CardContent>
              <p className="mb-2">Date: {event.date}</p>
              <p className="mb-4">Theme: {event.theme}</p>
              <Button>
                <Link href={`/events/${event.id}`}>Learn More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
