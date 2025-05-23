"use client"

import { useState, useEffect, useCallback } from 'react';
import { getUserActivities, deleteActivity as deleteDbActivity, type Activity } from '@/lib/db/activities';
import { useToast } from '@/components/ui/use-toast';
import type { ProgressStats } from './types';

export function useProgress(userId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalDistance: 0,
    targetDistance: 100,
    totalActivities: 0,
    targetActivities: 21
  });
  
  const { toast } = useToast();

  const calculateStats = useCallback((activities: Activity[]) => {
    const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
    return {
      totalDistance,
      targetDistance: 100,
      totalActivities: activities.length,
      targetActivities: 21
    };
  }, []);

  const updateActivities = useCallback((newActivity: Activity) => {
    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    setStats(calculateStats(updatedActivities));
  }, [activities, calculateStats]);

  const deleteActivity = useCallback(async (activityId: string) => {
    try {
      await deleteDbActivity(activityId);
      const updatedActivities = activities.filter(a => a.id !== activityId);
      setActivities(updatedActivities);
      setStats(calculateStats(updatedActivities));
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }, [activities, calculateStats]);

  useEffect(() => {
    async function loadActivities() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const userActivities = await getUserActivities(userId);
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
