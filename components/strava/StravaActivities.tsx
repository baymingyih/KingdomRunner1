"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MapPin, Timer, Calendar, TrendingUp, Heart, MessageCircle, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { logActivity, getActivitiesByStravaIds, Activity } from '@/lib/db/activities';
import { useAuth } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialWall } from '@/components/events/social/useSocialWall';
import { SocialActivityFeed } from '@/components/events/social/SocialActivityFeed';
import { ActivitySubmissionForm } from '@/components/events/social/ActivitySubmissionForm';

interface RawStravaActivity {
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
  const [rawStravaActivities, setRawStravaActivities] = useState<RawStravaActivity[]>([]);
  const [loggedActivitiesMap, setLoggedActivitiesMap] = useState<Map<string, Activity>>(new Map());
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<number | null>(null);
  const [expandedActivities, setExpandedActivities] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize social wall hook for the event
  const { 
    praiseActivity, 
    commentOnActivity, 
    shareActivity 
  } = useSocialWall(eventId.toString());

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
        setRawStravaActivities(data);
      } else {
        setRawStravaActivities(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 10);

      // Fetch corresponding logged activities
      if (data.length > 0) {
        const stravaIds = data.map((activity: RawStravaActivity) => activity.id.toString());
        const loggedActivities = await getActivitiesByStravaIds(user.uid, stravaIds);
        setLoggedActivitiesMap(prev => {
          const newMap = new Map(prev);
          loggedActivities.forEach((value, key) => newMap.set(key, value));
          return newMap;
        });
      }
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

  const handleImport = async (activity: RawStravaActivity) => {
    if (!user) return;
    
    setImporting(activity.id);
    try {
      // Convert seconds to hours and minutes
      const totalMinutes = Math.floor(activity.moving_time / 60);
      const hours = Math.floor(totalMinutes / 60).toString();
      const minutes = (totalMinutes % 60).toString();
      
      const loggedActivity = await logActivity({
        userId: user.uid,
        eventId: eventId.toString(),
        distance: (activity.distance / 1000).toString(), // Convert meters to kilometers
        hours,
        minutes,
        location: [activity.location_city, activity.location_country].filter(Boolean).join(', ') || 'Unknown location',
        notes: `Imported from Strava: ${activity.name} (Type: ${activity.type}, Elevation: ${Math.round(activity.total_elevation_gain)}m${activity.average_heartrate ? `, Avg HR: ${Math.round(activity.average_heartrate)} bpm` : ''})`,
        images: [],
        stravaActivityId: activity.id.toString(),
        elevationGain: activity.total_elevation_gain,
        averageHeartRate: activity.average_heartrate,
        maxHeartRate: activity.max_heartrate
      });

      // Update the logged activities map
      setLoggedActivitiesMap(prev => new Map(prev.set(activity.id.toString(), loggedActivity)));

      toast({
        title: "Activity imported",
        description: "Your Strava activity has been successfully logged.",
      });

      onActivityLogged();
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

  const toggleExpanded = (activityId: number) => {
    setExpandedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const formatPace = (speed: number) => {
    if (!speed || speed <= 0) return "0:00";
    const pace = 1000 / speed / 60; // Convert m/s to min/km
    const minutes = Math.floor(pace);
    const seconds = Math.floor((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  if (rawStravaActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent activities found on Strava</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {rawStravaActivities.map((activity) => {
            const loggedActivity = loggedActivitiesMap.get(activity.id.toString());
            const isExpanded = expandedActivities.has(activity.id);
            const isImported = !!loggedActivity;

            return (
              <Card key={activity.id} className={`transition-all duration-200 ${isImported ? 'border-green-200 bg-green-50/50' : 'hover:bg-muted/50'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {activity.type === 'Run' ? '🏃' : activity.type === 'Ride' ? '🚴' : '🏃'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{activity.name}</h4>
                          {isImported && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Imported
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(activity.id)}
                                className="h-8 w-8 p-0"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(activity.start_date_local), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            <span>{Math.floor(activity.moving_time / 60)} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{(activity.distance / 1000).toFixed(2)} km</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>{formatPace(activity.average_speed)}/km</span>
                          </div>
                        </div>

                        {activity.total_elevation_gain > 0 && (
                          <div className="text-sm text-muted-foreground">
                            <span>Elevation: {activity.total_elevation_gain}m</span>
                            {activity.average_heartrate && (
                              <span className="ml-4">Avg HR: {Math.round(activity.average_heartrate)} bpm</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!isImported && (
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
                          'Import & Add Reflection'
                        )}
                      </Button>
                    )}
                  </div>

                  <AnimatePresence>
                    {isImported && isExpanded && loggedActivity && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                      >
                        <Separator className="mb-4" />
                        
                        <div className="space-y-4">
                          {/* Activity Details */}
                          <div className="bg-muted/30 p-4 rounded-lg">
                            <h5 className="font-medium mb-2">Activity Details</h5>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Distance:</span>
                                <span className="ml-2 font-medium">{loggedActivity.distance.toFixed(2)} km</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="ml-2 font-medium">
                                  {loggedActivity.hours > 0 ? `${loggedActivity.hours}h ` : ''}
                                  {loggedActivity.minutes}m
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Location:</span>
                                <span className="ml-2 font-medium">{loggedActivity.location}</span>
                              </div>
                              {loggedActivity.elevationGain && (
                                <div>
                                  <span className="text-muted-foreground">Elevation:</span>
                                  <span className="ml-2 font-medium">{loggedActivity.elevationGain}m</span>
                                </div>
                              )}
                            </div>
                            
                            {loggedActivity.notes && (
                              <div className="mt-3">
                                <span className="text-muted-foreground text-sm">Notes:</span>
                                <p className="mt-1 text-sm">{loggedActivity.notes}</p>
                              </div>
                            )}
                          </div>

                          {/* Social Features */}
                          <div className="space-y-4">
                            <h5 className="font-medium">Prayer Reflections & Community</h5>
                            
                            {/* Activity Submission Form for adding reflections */}
                            <ActivitySubmissionForm 
                              eventId={eventId.toString()}
                              onSubmit={async (data) => {
                                // This would update the existing activity with new reflection
                                // For now, we'll just show a toast
                                toast({
                                  title: "Reflection added",
                                  description: "Your prayer reflection has been added to this activity.",
                                });
                              }}
                            />
                            
                            {/* Social Activity Feed */}
                            <SocialActivityFeed 
                              activities={[loggedActivity]}
                              praiseActivity={praiseActivity}
                              onComment={commentOnActivity}
                              onShare={shareActivity}
                              currentUser={user}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          })}
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
