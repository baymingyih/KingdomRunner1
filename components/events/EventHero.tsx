"use client"

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Event } from '@/lib/data/events';

export function EventHero({ event }: { event: Event }) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isOngoing = new Date() >= startDate && new Date() <= endDate;
  const isFuture = new Date() < startDate;

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden mb-8">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <Image
        src={event.image}
        alt={event.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-8">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {event.name}
        </motion.h1>
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Badge variant="secondary" className="text-lg py-1.5">
            <Calendar className="w-4 h-4 mr-2" />
            {startDate.toLocaleDateString('en-GB')} - {endDate.toLocaleDateString('en-GB')}
          </Badge>
          <Badge variant="secondary" className="text-lg py-1.5">
            <Users className="w-4 h-4 mr-2" />
            {event.participants} Participants
          </Badge>
          {isOngoing && (
            <Badge variant="secondary" className="text-lg py-1.5 bg-green-500/10 text-green-500">
              <Clock className="w-4 h-4 mr-2" />
              Event in Progress
            </Badge>
          )}
          {isFuture && (
            <Badge variant="secondary" className="text-lg py-1.5">
              <Clock className="w-4 h-4 mr-2" />
              Upcoming Event
            </Badge>
          )}
        </motion.div>
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button className="bg-primary hover:bg-primary/90">
            Register Now
          </Button>
          <Button className="bg-white/10 hover:bg-white/20">
            Share Event
          </Button>
        </motion.div>
      </div>
    </div>
  );
}