"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGlobalSocialWall } from '@/components/home/useGlobalSocialWall';
import { SocialActivityFeed } from '@/components/events/social/SocialActivityFeed';
import { LoadingSpinner } from '@/components/events/progress/LoadingSpinner';
import { ErrorDisplay } from '@/components/events/progress/ErrorDisplay';
import { useAuth } from '@/components/auth/AuthProvider';

export default function SocialWallPage() {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');
  const { activities, loading, error, hasMore } = useGlobalSocialWall(20);
  const { user } = useAuth();

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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Community Activity Wall</h1>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-muted-foreground">
            See what runners around the world are up to
          </p>
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
          praiseActivity={async () => {}}
          onComment={async () => {}}
          onShare={async () => {}}
          currentUser={user}
        />
        
        {hasMore && (
          <Button 
            onClick={() => {}}
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
    </main>
  );
}
