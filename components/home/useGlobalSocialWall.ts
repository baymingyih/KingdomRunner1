"use client"

import { useState, useEffect, useCallback } from 'react';
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
  firstName?: string;
  lastName?: string;
}

export function useGlobalSocialWall(limit: number = 10) {
  const [activities, setActivities] = useState<GlobalSocialActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const { user } = useAuthContext();

  // Fetch activities from all events
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const allActivities = await getAllActivities(limit);
      
      // Transform activities to include basic info
      const socialActivities: GlobalSocialActivity[] = allActivities.map((activity) => {
        // Log each activity's user data for debugging
        console.log('Raw activity user data:', {
          id: activity.id,
          userId: activity.userId,
          userName: activity.userName,
          firstName: activity.firstName,
          lastName: activity.lastName
        });
        
        return {
          ...activity,
          likes: [],
          likeCount: 0,
          comments: [],
          commentCount: 0
        };
      });
      
      // Only try to fetch event names if we have a user (authenticated)
      if (user) {
        await Promise.all(
          socialActivities.map(async (activity) => {
            try {
              const event = await getEventById(parseInt(activity.eventId));
              if (event) {
                activity.eventName = event.name;
              }
            } catch (eventError) {
              console.warn('Error fetching event details:', eventError);
            }
          })
        );
      }
      
      console.log('Fetched activities with complete user data:', socialActivities.map(a => ({
        id: a.id,
        userId: a.userId,
        userName: a.userName,
        firstName: a.firstName,
        lastName: a.lastName,
        userAvatar: a.userAvatar,
        hasName: !!(a.firstName || a.lastName || a.userName)
      })));
      setActivities(socialActivities);
      setHasMore(allActivities.length >= limit);
    } catch (error) {
      console.error('Error loading activities:', error);
      setError(error instanceof Error ? error : new Error('Failed to load activities'));
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

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
