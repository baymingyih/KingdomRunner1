"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { EventLeaderboard } from './EventLeaderboard';
import { EventPrayerGuide } from './EventPrayerGuide';
import { EventSocialWall } from './EventSocialWall';
import { EventUserProgress } from './EventUserProgress';
import { ProgressStats } from './progress/ProgressStats';
import { EventHero } from './EventHero';
import { EventOverview } from './EventOverview';
import { StravaReflectionDashboard } from '@/components/dashboard/StravaReflectionDashboard';
import { type Event } from '@/lib/data/events';
import { useAuth } from '@/components/auth/AuthProvider';
import { useProgress } from './progress/useProgress';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function EventDetailClient({ event }: { event: Event }) {
  const [selectedTab, setSelectedTab] = useState("social-wall");
  const { user } = useAuth();
  const { loading, error, activities, stats, updateActivities, deleteActivity } = 
    useProgress(user?.uid, event.id);

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="relative"
      >
        <EventHero event={event} />

        <Card className="mb-8">
          <CardContent className="p-4 sm:p-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
              <TabsList className="flex flex-wrap gap-2 sm:grid sm:grid-cols-5 sm:gap-4 bg-transparent px-2 py-2">
                <TabsTrigger value="overview" className="whitespace-nowrap">Overview</TabsTrigger>
                <TabsTrigger value="leaderboard" className="whitespace-nowrap">Leaderboard</TabsTrigger>
                <TabsTrigger value="social-wall" className="whitespace-nowrap">Encouragement</TabsTrigger>
                {user && <TabsTrigger value="my-progress" className="whitespace-nowrap">Manual+</TabsTrigger>}
                {user && <TabsTrigger value="strava-prayer" className="whitespace-nowrap">Strave+</TabsTrigger>}
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTab}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fadeIn}
                  transition={{ duration: 0.3 }}
                  className="mt-4 sm:mt-6"
                >
                  <TabsContent value="overview">
                    <EventOverview event={event} />
                  </TabsContent>

                  <TabsContent value="leaderboard">
                    <EventLeaderboard eventId={event.id} />
                  </TabsContent>

                  <TabsContent value="social-wall">
                    <EventSocialWall eventId={event.id} />
                  </TabsContent>

                  {user && (
                    <>
                      <TabsContent value="my-progress">
                        <EventUserProgress 
                          eventId={event.id}
                          stats={stats}
                          loading={loading}
                          error={error}
                          activities={activities}
                          onUpdate={updateActivities}
                          onDelete={deleteActivity}
                        />
                      </TabsContent>

                      <TabsContent value="strava-prayer" className="space-y-6">
                        <ProgressStats stats={stats} />
                        <StravaReflectionDashboard eventId={event.id} />
                      </TabsContent>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </AuthGuard>
  );
}
