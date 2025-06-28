"use client"

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface EventCardProps {
  event: {
    id: number;
    name: string;
    date: string;
    difficulty: string;
    participants: number;
    description: string;
    status: string;
  };
  delay?: number;
}

export function EventCard({ event, delay = 0 }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg">{event.name}</h3>
            <Badge variant={event.difficulty === "Beginner" ? "secondary" : "default"}>
              {event.difficulty}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {event.participants} joined
            </span>
          </div>
          
          <div className="flex gap-2">
            <Link href={`/events/${event.id}`} className="flex-1">
              <Button className="w-full">View Details</Button>
            </Link>
            <Button variant="outline">Quick Join</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}