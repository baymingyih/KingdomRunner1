"use client"

import { Button } from '@/components/ui/button';
import { HomeSocialFeed } from './HomeSocialFeed';
import { useGlobalSocialWall } from './useGlobalSocialWall';
import { LoadingSpinner } from '@/components/events/progress/LoadingSpinner';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export default function HomeSocialSection() {
  const { user } = useAuth();
  const { activities, loading, refreshActivities } = useGlobalSocialWall(5);

  // Don't render anything if user is not logged in
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <section className="my-12">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Community Activity</h2>
        <div className="flex gap-2">
            <Button 
              onClick={refreshActivities}
              disabled={loading}
              variant="default"
              size="lg"
              className="w-full"
            >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
            ) : (
              'Refresh'
            )}
          </Button>
            <Link href="/social-wall">
              <Button variant="default" size="lg" className="w-full">
                View All
              </Button>
            </Link>
        </div>
      </div>
      
      <HomeSocialFeed activities={activities} />
    </section>
  );
}
