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
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  getDoc, 
  setDoc, 
  Timestamp, 
  collection, 
  addDoc, 
  increment, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
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

  // Fetch social data for activities
  const fetchSocialData = useCallback(async (activityIds: string[]) => {
    if (!activityIds.length) return {};
    
    try {
      const socialData: Record<string, ActivitySocialDoc> = {};
      
      // Batch fetch social data for all activities
      const socialRefs = activityIds.map(id => doc(db, 'activitySocial', id));
      const socialDocs = await Promise.all(socialRefs.map(ref => getDoc(ref)));
      
      socialDocs.forEach((doc, index) => {
        if (doc.exists()) {
          const data = doc.data() as ActivitySocialDoc;
          socialData[activityIds[index]] = data;
        }
      });
      
      return socialData;
    } catch (error) {
      console.error('Error fetching social data:', error);
      return {};
    }
  }, []);

  // Fetch activities for the event
  const fetchActivities = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const eventActivities = await getEventActivities(eventId);
      
      // Get social data for all activities
      const activityIds = eventActivities.map(activity => activity.id!);
      const socialData = await fetchSocialData(activityIds);
      
      // Transform activities to include social features
      const socialActivities: SocialActivity[] = eventActivities.map(activity => {
        const activityId = activity.id!;
        const social = socialData[activityId];
        
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
  }, [eventId, toast, fetchSocialData]);

  // Load more activities
  const loadMoreActivities = useCallback(async () => {
    if (!lastVisible || !eventId) return;
    
    try {
      // Implement pagination logic here
      // For now, we'll just show a toast
      toast({
        title: "Loading more activities",
        description: "This feature is coming soon",
      });
    } catch (error) {
      console.error('Error loading more activities:', error);
      toast({
        title: "Error",
        description: "Failed to load more activities",
        variant: "destructive",
      });
    }
  }, [lastVisible, eventId, toast]);

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
      // Check if already praised
      const socialRef = doc(db, 'activitySocial', activityId);
      const socialDoc = await getDoc(socialRef);
      const alreadyPraised = socialDoc.exists() && 
        socialDoc.data().praises && 
        socialDoc.data().praises.includes(user.uid);
      
      // Update in Firestore first to ensure data consistency
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
        if (alreadyPraised) {
          // Remove praise
          await updateDoc(socialRef, {
            praises: arrayRemove(user.uid),
            praiseCount: increment(-1)
          });
        } else {
          // Add praise
          await updateDoc(socialRef, {
            praises: arrayUnion(user.uid),
            praiseCount: increment(1)
          });
        }
      }
      
      // Update local state after successful Firestore update
      setActivities(prev => prev.map(activity => {
        if (activity.id === activityId) {
          return {
            ...activity,
            praises: alreadyPraised 
              ? activity.praises?.filter(id => id !== user.uid)
              : [...(activity.praises || []), user.uid],
            praiseCount: alreadyPraised
              ? Math.max(0, (activity.praiseCount || 1) - 1)
              : (activity.praiseCount || 0) + 1
          };
        }
        return activity;
      }));
      
      // Refresh activities to ensure UI is in sync with database
      await fetchActivities();

    } catch (error) {
      console.error('Error praising activity:', error);
      toast({
        title: "Error",
        description: "Failed to praise activity",
        variant: "destructive",
      });
      // Revert optimistic update
      fetchActivities();
    }
  }, [toast, user, fetchActivities]);

  // Comment on an activity
  const commentOnActivity = useCallback(async (activityId: string, content: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get user data for the comment
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      // Create comment object
      const commentId = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newComment: Comment = {
        id: commentId,
        userId: user.uid,
        userName: userData?.firstName && userData?.lastName 
          ? `${userData.firstName} ${userData.lastName}`.trim()
          : user.displayName || 'Anonymous',
        userAvatar: userData?.avatar || user.photoURL || undefined,
        content: content.trim(),
        timestamp: new Date()
      };
      
      // Update in Firestore first to ensure data consistency
      const socialRef = doc(db, 'activitySocial', activityId);
      const socialDoc = await getDoc(socialRef);
      
      // Convert Date to Firestore Timestamp for Firebase storage
      const firestoreComment = {
        ...newComment,
        timestamp: Timestamp.fromDate(newComment.timestamp)
      };
      
      if (!socialDoc.exists()) {
        // Create document if it doesn't exist
        await setDoc(socialRef, {
          praises: [],
          praiseCount: 0,
          likes: [],
          likeCount: 0,
          comments: [firestoreComment],
          commentCount: 1
        });
      } else {
        // Get existing comments and add new one
        const existingData = socialDoc.data();
        const existingComments = existingData?.comments || [];
        const updatedComments = [...existingComments, firestoreComment];
        
        // Update document with new comments array
        await updateDoc(socialRef, {
          comments: updatedComments,
          commentCount: increment(1)
        });
      }

      // Update local state after successful Firestore update
      setActivities(prev => prev.map(activity => {
        if (activity.id === activityId) {
          return {
            ...activity,
            comments: [...(activity.comments || []), newComment],
            commentCount: (activity.commentCount || 0) + 1
          };
        }
        return activity;
      }));

      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
      
      // Refresh activities to ensure UI is in sync with database
      // This ensures we have the latest data including the new comment
      await fetchActivities();
      
    } catch (error) {
      console.error('Error commenting on activity:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
      // Revert optimistic update by refreshing activities
      fetchActivities();
    }
  }, [toast, user, fetchActivities]);

  // Share an activity
  const shareActivity = useCallback(async (activityId: string) => {
    try {
      // Get the activity to share
      const activity = activities.find(a => a.id === activityId);
      if (!activity) {
        throw new Error('Activity not found');
      }
      
      // Create share URL
      const shareUrl = `${window.location.origin}/activity/${activityId}`;
      
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `${activity.userName}'s ${activity.distance.toFixed(1)}km run`,
          text: activity.notes || `Check out this ${activity.distance.toFixed(1)}km run!`,
          url: shareUrl
        });
        
        toast({
          title: "Shared successfully",
          description: "Activity has been shared",
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: "Link copied",
          description: "Activity link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing activity:', error);
      
      // Don't show error for user cancellation
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to share activity",
        variant: "destructive",
      });
    }
  }, [activities, toast]);

  // Submit a new activity
  const submitActivity = useCallback(async (data: ActivityInput) => {
    try {
      const newActivity = await logActivity(data);
      
      // Add to local state
      setActivities(prev => [{
        ...newActivity,
        likes: [],
        likeCount: 0,
        praises: [],
        praiseCount: 0,
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