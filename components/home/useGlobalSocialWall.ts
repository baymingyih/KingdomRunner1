"use client"

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  getAllActivities, 
  Activity
} from '@/lib/db/activities';
import { getEventById } from '@/lib/data/events';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/init';

export interface GlobalSocialActivity extends Activity {
  eventName?: string;
  likes?: string[];
  likeCount?: number;
  praises?: string[];
  praiseCount?: number;
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
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());
  const { user } = useAuth();

  // Fetch social data for activities
  const fetchSocialData = useCallback(async (activityIds: string[]) => {
    if (!activityIds.length) return {};
    
    try {
      const socialData: Record<string, any> = {};
      
      // Batch fetch social data for all activities
      const socialRefs = activityIds.map(id => doc(db, 'activitySocial', id));
      const socialDocs = await Promise.all(socialRefs.map(ref => getDoc(ref)));
      
      socialDocs.forEach((doc, index) => {
        if (doc.exists()) {
          socialData[activityIds[index]] = doc.data();
        }
      });
      
      return socialData;
    } catch (error) {
      console.error('Error fetching social data:', error);
      return {};
    }
  }, []);

  // Fetch activities from all events
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const allActivities = await getAllActivities(limit);
      
      // Get social data for all activities
      const activityIds = allActivities.map(activity => activity.id!);
      
      // Only try to fetch social data if we have activities and a user (authenticated)
      let socialData: Record<string, {
        likes?: string[];
        likeCount?: number;
        praises?: string[];
        praiseCount?: number;
        comments?: any[];
        commentCount?: number;
      }> = {};
      if (activityIds.length > 0 && user) {
        socialData = await fetchSocialData(activityIds);
      }
      
      // Transform activities to include social features
      const socialActivities: GlobalSocialActivity[] = allActivities.map((activity) => {
        const activityId = activity.id!;
        const social = socialData[activityId];
        
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
          likes: social?.likes || [],
          likeCount: social?.likeCount || 0,
          praises: social?.praises || [],
          praiseCount: social?.praiseCount || 0,
          comments: social?.comments || [],
          commentCount: social?.commentCount || 0
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
      // Update the last refresh time
      setLastRefreshTime(Date.now());
    } catch (error) {
      console.error('Error loading activities:', error);
      setError(error instanceof Error ? error : new Error('Failed to load activities'));
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [limit, fetchSocialData, user]);

  // Initial load and refresh when lastRefreshTime changes
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, lastRefreshTime]);

  // Function to manually trigger a refresh
  const refreshActivities = useCallback(() => {
    // Update lastRefreshTime to trigger the useEffect
    setLastRefreshTime(Date.now());
  }, []);

  return {
    activities,
    loading,
    error,
    hasMore,
    refreshActivities,
    fetchActivities // Expose the original fetch function as well
  };
}
