"use client"

import { useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { logActivity } from '@/lib/db/activities';
import { LoadingSpinner } from './progress/LoadingSpinner';
import { ErrorDisplay } from './progress/ErrorDisplay';
import { ProgressStats } from './progress/ProgressStats';
import { ActivityForm } from './progress/ActivityForm';
import { useProgress } from './progress/useProgress';
import type { ActivityFormData } from './progress/types';

interface EventUserProgressProps {
  eventId: number;
}

export function EventUserProgress({ eventId }: EventUserProgressProps) {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthContext();
  const { toast } = useToast();
  const { loading, error, activities, stats, updateActivities } = useProgress(user?.uid);

  const handleSubmit = async (data: ActivityFormData) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      const activity = await logActivity({
        userId: user.uid,
        eventId: eventId.toString(),
        distance: data.distance.toString(),
        hours: data.hours.toString(),
        minutes: data.minutes.toString(),
        location: data.location,
        notes: data.notes,
        image: data.image
      });

      updateActivities(activity);
      
      toast({
        title: "Activity logged successfully!",
        description: "Your run has been recorded.",
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      toast({
        title: "Error logging activity",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to track your progress</p>
        <Button className="mt-4">
          <a href="/login">Sign In</a>
        </Button>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="space-y-6">
      <ProgressStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityForm 
          onSubmit={handleSubmit}
          submitting={submitting}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Activities</h3>
          {activities.length === 0 ? (
            <p className="text-muted-foreground">No activities recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 rounded-lg bg-muted">
                  <p className="font-medium">{activity.distance.toFixed(1)} km</p>
                  <p className="text-sm">{activity.hours}h {activity.minutes}m</p>
                  <p className="text-sm text-muted-foreground">{activity.location}</p>
                  {activity.notes && (
                    <p className="text-sm mt-2">{activity.notes}</p>
                  )}
                  {activity.imageUrl && (
                    <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-lg border">
                      <img
                        src={activity.imageUrl}
                        alt="Activity"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
