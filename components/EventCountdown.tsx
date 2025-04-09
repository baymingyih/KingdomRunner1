"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EventCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2025-05-21T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          FCA EAST GLOBAL CONFERENCE
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Hong Kong • May 21-25, 2025
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-center text-lg">
            Countdown to Conference Start
          </p>
          <div className="grid grid-cols-4 gap-4 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col bg-primary/10 p-4 rounded-lg">
                <span className="text-3xl font-bold text-primary">{value}</span>
                <span className="text-sm uppercase text-muted-foreground">{unit}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
