"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
      <div className="relative w-full aspect-[3/1] md:aspect-[2/1] h-[350px] md:h-[450px] bg-gray-100">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/kingdomrunnersdv1/o/tempimg%2FWhatsApp%20Image%202025-04-14%20at%204.54.17%20PM.jpeg?alt=media&token=17a282d4-3133-4a12-b9ec-a44723dfca73"
          alt="FCA East Global Conference"
          fill
          className="object-cover object-top rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col bg-primary/10 p-2 sm:p-4 rounded-lg">
                <span className="text-2xl sm:text-3xl font-bold text-primary">{value}</span>
                <span className="text-xs sm:text-sm uppercase text-muted-foreground">{unit}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
