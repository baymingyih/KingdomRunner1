"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ExternalLink } from 'lucide-react';
import { YouTubeEmbed } from '@/components/ui/youtube-embed';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchEvent = async () => {
      try {
        const response = await fetch('/api/events/current', { signal });
        if (!response.ok) {
          throw new Error('Failed to fetch event data');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError('Failed to load event data');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      abortController.abort();
    };
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
          <>
            <YouTubeEmbed url={event.youtubeUrl} className="mt-4" />
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={() => window.open('https://lovesingapore.org.sg/en/40day/', '_blank', 'noopener,noreferrer')}
                className="flex items-center gap-2 bg-black text-white hover:bg-black/80"
              >
                <ExternalLink className="h-4 w-4" />
                Visit LoveSingapore 40 Days Prayer
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
