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
import { EventHero } from './EventHero';
import { EventOverview } from './EventOverview';
import { type Event } from '@/lib/data/events';
import { useAuthContext } from '@/components/auth/AuthProvider';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

import { AuthGuard } from '@/components/auth/AuthGuard';

export default function EventDetailClient({ event }: { event: Event }) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { user } = useAuthContext();

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
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 bg-transparent">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="social-wall">Social Wall</TabsTrigger>
                {user && <TabsTrigger value="my-progress">My Progress</TabsTrigger>}
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
                    <EventLeaderboard leaderboard={event.leaderboard} />
                  </TabsContent>

                  <TabsContent value="social-wall">
                    <EventSocialWall eventId={event.id} />
                  </TabsContent>

                  {user && (
                    <TabsContent value="my-progress">
                      <EventUserProgress eventId={event.id} />
                    </TabsContent>
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
