"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { YouTubeEmbed } from '@/components/ui/youtube-embed';
import { useEffect, useState } from 'react';

interface Event {
  id: string;
  youtubeUrl?: string;
}

export default function DailyPrayer() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch('/api/events/current');
        if (!response.ok) {
          throw new Error('Failed to fetch event data');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError('Failed to load event data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          40 Days All In Prayer Run (Singapore)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {event?.youtubeUrl && (
          <YouTubeEmbed url={event.youtubeUrl} className="mt-4" />
        )}
      </CardContent>
    </Card>
  );
}
