"use client"

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialActivityFeed } from './social/SocialActivityFeed';
import { ActivitySubmissionForm } from './social/ActivitySubmissionForm';
import { useSocialWall } from './social/useSocialWall';
import { LoadingSpinner } from './progress/LoadingSpinner';
import { ErrorDisplay } from './progress/ErrorDisplay';

interface EventSocialWallProps {
  eventId: number;
}

export function EventSocialWall({ eventId }: EventSocialWallProps) {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');
  const { user } = useAuth();
  const { 
    activities, 
    loading, 
    error, 
    praiseActivity, 
    commentOnActivity, 
    shareActivity,
    submitActivity,
    loadMoreActivities,
    hasMore
  } = useSocialWall(eventId.toString());

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">No activities yet</h3>
        <p className="text-muted-foreground">
          Be the first to share your run and reflection!
        </p>
      </div>
    );
  }

  // Sort activities based on active tab
  const sortedActivities = [...activities].sort((a, b) => {
    if (activeTab === 'latest') {
      return b.timestamp.getTime() - a.timestamp.getTime();
    } else {
      // Sort by likes for 'popular' tab
      return (b.likeCount || 0) - (a.likeCount || 0);
    }
  });

  return (
    <div className="space-y-6">
      {user && (
        <ActivitySubmissionForm 
          eventId={eventId.toString()} 
          onSubmit={submitActivity} 
        />
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Community Activity Feed</h2>
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'latest' | 'popular')}
          className="w-[200px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <SocialActivityFeed 
        activities={sortedActivities}
        praiseActivity={praiseActivity}
        onComment={commentOnActivity}
        onShare={shareActivity}
        currentUser={user}
      />
      
      {hasMore && (
        <Button 
          onClick={loadMoreActivities}
          className="w-full mt-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          Load More
        </Button>
      )}
      
      {!user && (
        <div className="text-center py-4 mt-6 border-t">
          <p className="text-muted-foreground mb-2">Sign in to share your activities and interact with others</p>
          <a href="/login">
            <Button>
              Sign In
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
