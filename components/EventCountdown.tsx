"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/useAuth';

export default function EventCountdown() {
  const { user } = useAuth();
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
    <Card className="my-8 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
      <CardHeader className="p-6 md:p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/kingdomrunnersdv1/o/tempimg%2FWhatsApp%20Image%202025-04-14%20at%204.54.17%20PM.jpeg?alt=media&token=17a282d4-3133-4a12-b9ec-a44723dfca73"
              alt="FCA East Global Conference"
              width={800}
              height={450}
              className="object-cover"
              priority
            />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center">
            FCA EAST GLOBAL CONFERENCE
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            Hong Kong • May 21-25, 2025
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 md:px-8 md:pb-8">
        <div className="space-y-6">
          <h3 className="text-center text-xl md:text-2xl font-semibold text-primary">
            Countdown to Conference Start
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <motion.div 
                key={unit}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
                className="flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20"
              >
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  {value}
                </span>
                <span className="text-sm uppercase text-muted-foreground mt-1">
                  {unit}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/events/1">
              <Button 
                className="px-12 py-7 text-lg font-bold bg-black/90 text-white hover:bg-black border-2 border-white hover:border-white/80 transition-all duration-200 rounded-full h-auto"
              >
                {user ? 'View Run Progress' : 'Join Virtual Run'}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
