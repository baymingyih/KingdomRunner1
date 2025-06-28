"use client"

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface RunActivityCardProps {
  run: {
    id: number;
    name: string;
    distance: number;
    time: string;
    pace: string;
    date: string;
  };
  delay?: number;
}

export function RunActivityCard({ run, delay = 0 }: RunActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="hover:shadow-sm transition-shadow">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{run.name}</h4>
            <Badge variant="outline" className="text-xs">{run.date}</Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {run.distance} km
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {run.time}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {run.pace}/km
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}