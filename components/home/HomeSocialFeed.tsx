"use client"

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { GlobalSocialActivity } from './useGlobalSocialWall';

interface HomeSocialFeedProps {
  activities: GlobalSocialActivity[];
  limit?: number;
}

export function HomeSocialFeed({ activities, limit = 3 }: HomeSocialFeedProps) {
  // Limit the number of activities to display
  const displayActivities = activities.slice(0, limit);

  if (displayActivities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No activities have been shared yet.</p>
          <p className="text-sm mt-2">Be the first to share your run!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {displayActivities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
          >
            <Card className="h-full">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={activity.userAvatar} />
                    <AvatarFallback>
                      {activity.userName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold">{activity.userName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                    {activity.eventName && (
                      <Link href={`/events/${activity.eventId}`} className="text-xs text-primary hover:underline">
                        {activity.eventName}
                      </Link>
                    )}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Timer className="h-4 w-4" />
                    <span>{Math.floor(activity.duration / 60)} minutes</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{activity.location}</span>
                  </div>
                  
                  <p className="text-lg font-semibold mb-2">
                    {activity.distance.toFixed(1)} km
                  </p>
                  
                  {activity.notes && (
                    <p className="text-sm mb-3 line-clamp-2">{activity.notes}</p>
                  )}
                  
                  {activity.imageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border mb-3">
                      <img
                        src={activity.imageUrl}
                        alt="Activity"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-auto">
                  <Link href={`/events/${activity.eventId}`}>
                    <Button className="w-full border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                      View Event
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
