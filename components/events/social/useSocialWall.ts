"use client"

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { 
  getEventActivities, 
  logActivity, 
  Activity, 
  ActivityInput 
} from '@/lib/db/activities';
import { doc, updateDoc, arrayUnion, getDoc, setDoc, Timestamp, collection, addDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/init';

export interface SocialActivity extends Activity {
  likes?: string[];
  likeCount?: number;
  praises?: string[];
  praiseCount?: number;
  comments?: Comment[];
  commentCount?: number;
}

interface ActivitySocialDoc {
  praises: string[];
  praiseCount: number;
  likes?: string[];
  likeCount?: number;
  comments?: Comment[];
  commentCount?: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
}

export function useSocialWall(eventId: string) {
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuthContext();

  // Fetch activities for the event
  const fetchActivities = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const eventActivities = await getEventActivities(eventId);
      
      // Transform activities to include social features
      const socialActivities: SocialActivity[] = eventActivities.map(activity => {
        // Simplified: no social features for now
        return {
          ...activity,
          likes: [],
          likeCount: 0,
          comments: [],
          commentCount: 0
        };
      });
      
      setActivities(socialActivities);
      setHasMore(eventActivities.length >= 10); // Assuming we fetch 10 at a time
      if (eventActivities.length > 0) {
        setLastVisible(eventActivities[eventActivities.length - 1].timestamp);
      }
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
  }, [eventId, toast]);

  // Load more activities
  const loadMoreActivities = useCallback(async () => {
    // This would implement pagination logic
    // For now, we'll just show a toast
    toast({
      title: "Loading more activities",
      description: "This feature is coming soon",
    });
  }, [toast]);

  // Praise an activity
  const praiseActivity = useCallback(async (activityId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to praise",
        variant: "destructive",
      });
      return;
    }

    try {
      // Optimistic UI update
      setActivities(prev => prev.map(activity => {
        if (activity.id === activityId) {
          const alreadyPraised = activity.praises?.includes(user.uid);
          return {
            ...activity,
            praises: alreadyPraised 
              ? activity.praises?.filter(id => id !== user.uid)
              : [...(activity.praises || []), user.uid],
            praiseCount: alreadyPraised
              ? (activity.praiseCount || 1) - 1
              : (activity.praiseCount || 0) + 1
          };
        }
        return activity;
      }));

      // Update in Firestore - use activitySocial collection
      const socialRef = doc(db, 'activitySocial', activityId);
      const socialDoc = await getDoc(socialRef);
      
      if (!socialDoc.exists()) {
        // Create document if it doesn't exist
        await setDoc(socialRef, {
          praises: [user.uid],
          praiseCount: 1,
          likes: [],
          likeCount: 0,
          comments: [],
          commentCount: 0
        });
      } else {
        // Update existing document
        await updateDoc(socialRef, {
          'praises': arrayUnion(user.uid),
          'praiseCount': increment(1)
        });
      }

    } catch (error) {
      console.error('Error praising activity:', error);
      toast({
        title: "Error",
        description: "Failed to praise activity",
        variant: "destructive",
      });
      // Revert optimistic update
      setActivities(prev => prev.map(activity => {
        if (activity.id === activityId) {
          return {
            ...activity,
            praises: activity.praises?.filter(id => id !== user?.uid),
            praiseCount: Math.max(0, (activity.praiseCount || 1) - 1)
          };
        }
        return activity;
      }));
    }
  }, [toast, user]);

  // Comment on an activity
  const commentOnActivity = useCallback(async (activityId: string, content: string) => {
    // Simplified: just show a toast for now
    toast({
      title: "Comment feature",
      description: "This feature is coming soon",
    });
  }, [toast]);

  // Share an activity
  const shareActivity = useCallback(async (activityId: string) => {
    // Simplified: just show a toast for now
    toast({
      title: "Share feature",
      description: "This feature is coming soon",
    });
  }, [toast]);

  // Submit a new activity
  const submitActivity = useCallback(async (data: ActivityInput) => {
    try {
      const newActivity = await logActivity(data);
      
      // Add to local state
      setActivities(prev => [{
        ...newActivity,
        likes: [],
        likeCount: 0,
        comments: [],
        commentCount: 0
      }, ...prev]);
      
      toast({
        title: "Success",
        description: "Activity posted successfully",
      });
      
      return newActivity;
    } catch (error) {
      console.error('Error submitting activity:', error);
      toast({
        title: "Error",
        description: "Failed to post activity",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    hasMore,
    praiseActivity,
    commentOnActivity,
    shareActivity,
    submitActivity,
    loadMoreActivities
  };
}
