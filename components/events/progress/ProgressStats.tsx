"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ProgressStats as Stats } from './types';

export function ProgressStats({ stats }: { stats: Stats }) {
  const distanceProgress = (stats.totalDistance / stats.targetDistance) * 100;
  const activitiesProgress = (stats.totalActivities / stats.targetActivities) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Distance Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={distanceProgress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {stats.totalDistance.toFixed(1)} km of {stats.targetDistance} km
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activities Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={activitiesProgress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {stats.totalActivities} of {stats.targetActivities} activities
          </p>
        </CardContent>
      </Card>
    </div>
  );
}