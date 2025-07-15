"use client"

import { useState, useEffect, useCallback } from 'react';
import { getUserActivities, deleteActivity as deleteDbActivity, type Activity } from '@/lib/db/activities';
import { useToast } from '@/components/ui/use-toast';
import type { ProgressStats } from './types';
import { auth } from '@/lib/firebase/init';

export function useProgress(userId: string | undefined, eventId?: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalDistance: 0,
    targetDistance: 100,
    totalActivities: 0,
    targetActivities: 40
  });
  
  const { toast } = useToast();

  const calculateStats = useCallback((activities: Activity[]) => {
    const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
    return {
      totalDistance,
      targetDistance: 100,
      totalActivities: activities.length,
      targetActivities: 40
    };
  }, []);

  const updateActivities = useCallback((newActivity: Activity) => {
    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    setStats(calculateStats(updatedActivities));
  }, [activities, calculateStats]);

  const deleteActivity = useCallback(async (activityId: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch('/api/activities/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activityId, token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete activity');
      }

      const result = await response.json();

      toast({
        title: "Activity Deleted",
        description: result.message,
      });

      const updatedActivities = activities.filter(a => a.id !== activityId);
      setActivities(updatedActivities);
      setStats(calculateStats(updatedActivities));
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast({
        title: "Error deleting activity",
        description: error instanceof Error ? error.message : 'Failed to delete activity',
        variant: "destructive",
      });
      throw error;
    }
  }, [activities, calculateStats, toast]);

  useEffect(() => {
    async function loadActivities() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const userActivities = await getUserActivities(userId, eventId);
        setActivities(userActivities);
        setStats(calculateStats(userActivities));
      } catch (error) {
        console.error('Error loading activities:', error);
        setError(error instanceof Error ? error : new Error('Failed to load activities'));
        toast({
          title: "Error loading activities",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [userId, toast, calculateStats]);

  return {
    loading,
    error,
    activities,
    stats,
    updateActivities,
    deleteActivity
  };
}
