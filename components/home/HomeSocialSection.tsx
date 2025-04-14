"use client"

import { Button } from '@/components/ui/button';
import { HomeSocialFeed } from './HomeSocialFeed';
import { useGlobalSocialWall } from './useGlobalSocialWall';
import { LoadingSpinner } from '@/components/events/progress/LoadingSpinner';
import Link from 'next/link';
import { useAuthContext } from '@/components/auth/AuthProvider';

export default function HomeSocialSection() {
  const { user } = useAuthContext();
  const { activities, loading } = useGlobalSocialWall(3);

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
        <Link href="/social-wall">
          <Button className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
            View All
          </Button>
        </Link>
      </div>
      
      <HomeSocialFeed activities={activities} limit={3} />
    </section>
  );
}
