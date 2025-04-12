"use client"

import { Activity } from '@/lib/db/activities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Timer, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentRunsProps {
  activities: Activity[];
}

export function RecentRuns({ activities }: RecentRunsProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No activities recorded yet. Start logging your runs!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Runs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">
                      {activity.distance.toFixed(2)} km
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: require('date-fns/locale/en-GB') })}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      <span>{Math.floor(activity.duration / 60)} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{activity.location}</span>
                    </div>
                  </div>
                  
                  {activity.notes && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      {activity.notes}
                    </p>
                  )}
                  {(activity.imageUrl || activity.imageUrls) && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {activity.imageUrl && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                          <img
                            src={activity.imageUrl}
                            alt="Activity"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      {activity.imageUrls?.map((url, index) => (
                        <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg border">
                          <img
                            src={url}
                            alt={`Activity ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
