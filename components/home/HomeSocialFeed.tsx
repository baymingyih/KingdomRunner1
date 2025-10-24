"use client"

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { GlobalSocialActivity } from './useGlobalSocialWall';

interface HomeSocialFeedProps {
  activities: GlobalSocialActivity[];
}

export function HomeSocialFeed({ activities }: HomeSocialFeedProps) {
  if (activities.length === 0) {
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
        {activities.map((activity) => (
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
                    <h3 className="font-semibold">
                      {/* Prioritize firstName and lastName if available */}
                      {(activity.firstName || activity.lastName) 
                        ? `${activity.firstName || ''} ${activity.lastName || ''}`.trim()
                        : activity.userName || 'Anonymous'}
                    </h3>
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
                    <span>
                      {activity.hours > 0 ? `${activity.hours}h ` : ''}
                      {activity.minutes > 0 ? `${activity.minutes}m` : activity.hours > 0 ? '0m' : '0 minutes'}
                    </span>
                  </div>
                  
                  <p className="text-lg font-semibold mb-2">
                    {activity.distance.toFixed(1)} km
                  </p>
                  
                  {activity.notes && (
                    <p className="text-sm mb-3 line-clamp-2">{activity.notes}</p>
                  )}
                  
                  {(activity.imageUrl || (activity.imageUrls && activity.imageUrls.length > 0) || (activity.images && activity.images.length > 0)) && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border mb-3">
                      <img
                        src={`${activity.imageUrl || (activity.imageUrls && activity.imageUrls[0]) || (activity.images && activity.images[0])}?t=${activity.timestamp.getTime()}`}
                        alt="Activity"
                        className="h-full w-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-auto">
                  <Link href={`/events/${activity.eventId}`}>
                    <Button variant="default" size="lg" className="w-full">
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
