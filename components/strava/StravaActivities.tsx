"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MapPin, Timer, Calendar, TrendingUp, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { logActivity } from '@/lib/db/activities';
import { useAuth } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';
import { ActivityInput } from '@/lib/schemas/activity';

interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  location_city?: string;
  location_country?: string;
  map?: {
    summary_polyline: string;
  };
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  type: string;
}

interface StravaActivitiesProps {
  eventId: number;
  onActivityLogged: () => void;
}

export default function StravaActivities({ eventId, onActivityLogged }: StravaActivitiesProps) {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchActivities = async (pageNum: number) => {
    try {
      setError(null);
      if (!user) {
        throw new Error('User not authenticated');
      }
      const response = await fetch(`/api/strava/activities?page=${pageNum}&per_page=10&userId=${user.uid}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch activities');
      }
      const data = await response.json();
      if (pageNum === 1) {
        setActivities(data);
      } else {
        setActivities(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 10);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load activities';
      setError(message);
      toast({
        title: "Error loading activities",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchActivities(nextPage);
  };

  const handleImport = async (activity: StravaActivity) => {
    if (!user) return;
    
    setImporting(activity.id);
    try {
      // Convert seconds to hours and minutes
      const totalMinutes = Math.floor(activity.moving_time / 60);
      const hours = Math.floor(totalMinutes / 60).toString();
      const minutes = (totalMinutes % 60).toString();
      
      await logActivity({
        userId: user.uid,
        eventId: eventId.toString(),
        distance: (activity.distance / 1000).toString(), // Convert meters to kilometers
        hours,
        minutes,
        location: [activity.location_city, activity.location_country].filter(Boolean).join(', ') || 'Unknown location',
        notes: `Imported from Strava: ${activity.name} (Type: ${activity.type}, Elevation: ${Math.round(activity.total_elevation_gain)}m${activity.average_heartrate ? `, Avg HR: ${Math.round(activity.average_heartrate)} bpm` : ''})`,
        images: []
      });

      toast({
        title: "Activity imported",
        description: "Your Strava activity has been successfully logged.",
      });

      onActivityLogged();
      
      // Remove the imported activity from the list
      setActivities(prev => prev.filter(a => a.id !== activity.id));
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => fetchActivities(1)} className="gap-2">
          <Loader2 className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent activities found on Strava</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold">{activity.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(activity.start_date_local), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        <span>{Math.floor(activity.moving_time / 60)} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{(activity.distance / 1000).toFixed(2)} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>{activity.total_elevation_gain}m gain</span>
                      </div>
                      {activity.average_heartrate && (
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span>{Math.round(activity.average_heartrate)} bpm avg</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleImport(activity)}
                    disabled={importing === activity.id}
                    className="gap-2"
                  >
                    {importing === activity.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      'Import'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="w-full gap-2"
          >
            Load More Activities
          </Button>
        </div>
      )}
    </div>
  );
}
