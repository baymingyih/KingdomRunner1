"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface PrayerStreakCardProps {
  streak: number;
  delay?: number;
}

export function PrayerStreakCard({ streak, delay = 0 }: PrayerStreakCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Prayer Streak</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            className="text-4xl font-bold text-primary mb-2"
          >
            {streak}
          </motion.div>
          <p className="text-muted-foreground">days in a row</p>
          
          <div className="mt-4 flex justify-center">
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.3 + (i * 0.1) }}
                  className={`w-3 h-3 rounded-full ${
                    i < streak ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}