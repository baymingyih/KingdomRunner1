"use client"

import { useState } from 'react';
import { Activity } from '@/lib/db/activities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Timer, MapPin, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { enGB } from 'date-fns/locale';

interface RecentRunsProps {
  activities: Activity[];
  onDelete?: (activityId: string) => Promise<void>;
}

export function RecentRuns({ activities, onDelete }: RecentRunsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

  const handleDeleteClick = (activityId: string) => {
    setActivityToDelete(activityId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete || !onDelete) return;
    try {
      await onDelete(activityToDelete);
    } finally {
      setShowConfirm(false);
      setActivityToDelete(null);
    }
  };
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
    <>
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: enGB })}
                        </span>
                        {onDelete && (
                          <button 
                            onClick={() => handleDeleteClick(activity.id!)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Delete activity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
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

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this activity and remove its distance from your progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Activity
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
