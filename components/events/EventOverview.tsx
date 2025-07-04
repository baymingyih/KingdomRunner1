"use client"

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { type Event } from '@/lib/data/events';
import { YouTubeEmbed } from '@/components/ui/youtube-embed';
import { Button } from '@/components/ui/button';

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

        {event.youtubeUrl && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Event Video</h3>
            <YouTubeEmbed url={event.youtubeUrl} className="mt-2" />
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={() => window.open('https://lovesingapore.org.sg/en/40day/', '_blank', 'noopener,noreferrer')}
                className="flex items-center gap-2 bg-black text-white hover:bg-black/80"
              >
                <ExternalLink className="h-4 w-4" />
                Visit LoveSingapore 40 Days Prayer
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">Event Details</h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  40 days
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
                  Join Runners-In-Christ from around the world
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">R.U.N Guide</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">R.EFLECT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">Read and Reflect on a Bible verse</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">U.NDERSTAND</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">Understand the core message God is trying to speak to you through this verse</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">N.AVIGATE</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">Navigate your next steps & how you can apply what God has spoken to you</p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
