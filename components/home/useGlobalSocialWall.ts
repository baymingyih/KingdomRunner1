"use client"

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { 
  getAllActivities, 
  Activity
} from '@/lib/db/activities';
import { getEventById } from '@/lib/data/events';

export interface GlobalSocialActivity extends Activity {
  eventName?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any[];
  commentCount?: number;
}

export function useGlobalSocialWall(limit: number = 10) {
  const [activities, setActivities] = useState<GlobalSocialActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthContext();

  // Fetch activities from all events
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const allActivities = await getAllActivities(limit);
      
      // Transform activities to include event name and social features
      const socialActivities: GlobalSocialActivity[] = await Promise.all(
        allActivities.map(async (activity) => {
          try {
            // Get event name
            let eventName = undefined;
            try {
              const event = await getEventById(parseInt(activity.eventId));
              if (event) {
                eventName = event.name;
              }
            } catch (eventError) {
              console.warn('Error fetching event details:', eventError);
            }
            
            return {
              ...activity,
              eventName,
              likes: [],
              likeCount: 0,
              comments: [],
              commentCount: 0
            };
          } catch (error) {
            console.error('Error processing activity:', error);
            return {
              ...activity,
              likes: [],
              likeCount: 0,
              comments: [],
              commentCount: 0
            };
          }
        })
      );
      
      setActivities(socialActivities);
      setHasMore(allActivities.length >= limit);
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
  }, [limit, toast]);

  // Initial load
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    hasMore
  };
}
