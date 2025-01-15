"use client"

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import { type Event } from '@/lib/data/events';

export function EventOverview({ event }: { event: Event }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold mb-4">About this Event</h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">Event Details</h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {Math.ceil((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">Virtual Event - Run Anywhere</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Community</p>
                <p className="text-sm text-muted-foreground">
                  Join {event.participants} runners from around the world
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Event Prayer Guide</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4">
            {event.prayerGuide.map((guide, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Day {guide.day}: {guide.title}</CardTitle>
                  <p className="text-sm italic text-muted-foreground">{guide.verse}</p>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{guide.prayer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}