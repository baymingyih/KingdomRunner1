"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressStats {
  totalDistance: number;
  targetDistance: number;
  completedRuns: number;
  targetRuns: number;
  achievements: number;
}

interface ProgressDashboardProps {
  stats: ProgressStats;
}

export function ProgressDashboard({ stats }: ProgressDashboardProps) {
  const distanceProgress = (stats.totalDistance / stats.targetDistance) * 100;
  const runsProgress = (stats.completedRuns / stats.targetRuns) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Distance Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={distanceProgress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {stats.totalDistance.toFixed(1)} km of {stats.targetDistance} km
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Completed Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={runsProgress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {stats.completedRuns} of {stats.targetRuns} runs
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {stats.achievements}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Badges earned
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}