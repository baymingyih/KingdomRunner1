"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import type { Activity } from '@/lib/db/activities';

interface ActivityFeedProps {
  activities: Activity[];
  onLike: (activityId: string) => Promise<void>;
  onComment: (activityId: string, comment: string) => Promise<void>;
}

export function ActivityFeed({ activities, onLike, onComment }: ActivityFeedProps) {
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={activity.userAvatar} />
                    <AvatarFallback>
                      {activity.userName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{activity.userName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-lg font-semibold">
                        {activity.distance.toFixed(1)} km in {activity.hours > 0 ? `${activity.hours} hr ${activity.minutes} min` : `${activity.minutes} min`}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.location}
                      </p>
                      {activity.notes && (
                        <p className="mt-2">{activity.notes}</p>
                      )}
                      
                      {activity.imageUrl && (
                        <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-lg border">
                          <img
                            src={activity.imageUrl}
                            alt="Activity"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-4 mt-4">
<Button
  onClick={() => onLike(activity.id!)}
>
                        <Heart className="h-4 w-4 mr-2" />
                        Like
                      </Button>
                      <Button
                        onClick={() => setExpandedActivity(activity.id || null)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comment
                      </Button>
                      <Button>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
