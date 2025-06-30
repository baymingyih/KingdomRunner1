"use client"

import { useState, useEffect, useCallback, useMemo } from 'react';
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

export function useGlobalSocialWall(limit = 5) {
  const [activities, setActivities] = useState<GlobalSocialActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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
      console.log('Fetching all activities...');
      const allActivities = await getAllActivities(limit);
      console.log(`Fetched ${allActivities.length} activities (limit: ${limit})`, allActivities);
      
      // Get social data for all activities
      const activityIds = allActivities.map(activity => activity.id!);
      console.log('Activity IDs for social data:', activityIds);
      
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
        console.log('Fetching social data...');
        socialData = await fetchSocialData(activityIds);
        console.log('Fetched social data:', socialData);
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
              const event = await getEventById(activity.eventId);
              if (event) {
                activity.eventName = event.name;
              }
            } catch (eventError) {
              console.warn('Error fetching event details:', eventError);
            }
          })
        );
      }
      
      console.log(`Final activities count: ${socialActivities.length}`, socialActivities.map(a => ({
        id: a.id,
        userId: a.userId,
        userName: a.userName,
        firstName: a.firstName,
        lastName: a.lastName,
        userAvatar: a.userAvatar,
        hasName: !!(a.firstName || a.lastName || a.userName)
      })));
      setActivities(socialActivities);
      // Update the last refresh time
      setLastRefreshTime(Date.now());
    } catch (error) {
      console.error('Error loading activities:', error);
      setError(error instanceof Error ? error : new Error('Failed to load activities'));
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [fetchSocialData, user]);

  // Initial load and refresh when lastRefreshTime changes
  useEffect(() => {
    fetchActivities();
  }, [lastRefreshTime]); // Removed fetchActivities from dependencies since it's stable

  // Function to manually trigger a refresh
  const refreshActivities = useCallback(() => {
    // Update lastRefreshTime to trigger the useEffect
    setLastRefreshTime(Date.now());
  }, []);

  // Memoize the returned object to prevent unnecessary re-renders
  const result = useMemo(() => ({
    activities,
    loading,
    error,
    refreshActivities,
    fetchActivities
  }), [activities, loading, error, refreshActivities, fetchActivities]);

  return result;
}
