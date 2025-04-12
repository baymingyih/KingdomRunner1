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
import { RecentRuns } from './progress/RecentRuns';
import { useProgress } from './progress/useProgress';
import type { ActivityFormData } from './progress/types';

interface EventUserProgressProps {
  eventId: number;
}

export function EventUserProgress({ eventId }: EventUserProgressProps) {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthContext();
  const { toast } = useToast();
  const { loading, error, activities, stats, updateActivities, deleteActivity } = useProgress(user?.uid);

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
        images: data.images
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
        
        <RecentRuns 
          activities={activities}
          onDelete={deleteActivity}
        />
      </div>
    </div>
  );
}
