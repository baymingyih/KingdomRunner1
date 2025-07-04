"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StravaConnect, type StravaStatus } from '@/components/strava/StravaConnect';
import { 
  Calendar, 
  MapPin, 
  Timer, 
  TrendingUp, 
  Heart, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Plus,
  CheckCircle,
  Undo2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useAuth } from '@/components/auth/AuthProvider';
import { logActivity, deleteActivity, type Activity } from '@/lib/db/activities';
import { uploadActivityImage } from '@/lib/storage/uploadImage';

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
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  type: string;
}

interface ImportedActivity extends Activity {
  stravaData?: StravaActivity;
  isImported?: boolean;
  images?: string[];
}

interface ReflectionState {
  activityId: string;
  content: string;
  isEditing: boolean;
  originalContent: string;
}

interface DeletedReflection {
  activityId: string;
  content: string;
  timestamp: number;
}

interface StravaReflectionDashboardProps {
  eventId: string;
}

export function StravaReflectionDashboard({ eventId }: StravaReflectionDashboardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [stravaActivities, setStravaActivities] = useState<StravaActivity[]>([]);
  const [importedActivities, setImportedActivities] = useState<Map<string, ImportedActivity>>(new Map());
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<number | null>(null);
  const [reflections, setReflections] = useState<Map<string, ReflectionState>>(new Map());
  const [stravaStatus, setStravaStatus] = useState<StravaStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [deletedReflections, setDeletedReflections] = useState<DeletedReflection[]>([]);
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({});
  // Removed auto-save timeout state

  // Fetch Strava activities
  // Check Strava status on mount
  useEffect(() => {
    const checkStravaStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setError(null);
        const response = await fetch('/api/strava/status', {
          credentials: 'include'
        });
        if (response.ok) {
          const status = await response.json();
          setStravaStatus(status);
        } else {
          const data = await response.json().catch(() => ({}));
          console.error('Failed to check Strava status:', response.status, data);
          setError(data.error || 'Failed to check Strava connection status');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking Strava status:', error);
        setError('Failed to check Strava connection status');
        setLoading(false);
      }
    };

    checkStravaStatus();
  }, [user]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user || !stravaStatus?.connected) {
        setLoading(false);
        return;
      }
      
      try {
        setError(null);
        setLoading(true);
        console.log('Fetching Strava activities...');
        const response = await fetch(`/api/strava/activities?per_page=40`, {
          credentials: 'include' // Include cookies in the request
        });
        if (response.ok) {
          const activities = await response.json();
          console.log('Activities fetched:', activities);
          const runs = activities.filter((a: StravaActivity) => a.type === 'Run');
          console.log('Filtered runs:', runs);
          setStravaActivities(runs);
          
          // Check which activities are already imported
          const stravaIds = runs.map((a: StravaActivity) => a.id.toString());
          const { getActivitiesByStravaIds } = await import('@/lib/db/activities');
          const importedMap = await getActivitiesByStravaIds(user.uid, stravaIds);
          setImportedActivities(importedMap);
          
          // Initialize reflections state
          const reflectionsMap = new Map<string, ReflectionState>();
          importedMap.forEach((activity, stravaId) => {
            if (activity.notes) {
              reflectionsMap.set(activity.id!, {
                activityId: activity.id!,
                content: activity.notes,
                isEditing: false,
                originalContent: activity.notes
              });
            }
          });
          setReflections(reflectionsMap);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading(false);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load Strava activities';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user, stravaStatus, toast]);

  const formatPace = (speed: number) => {
    if (!speed || speed <= 0) return "0:00";
    const pace = 1000 / speed / 60;
    const minutes = Math.floor(pace);
    const seconds = Math.floor((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleImport = async (activity: StravaActivity) => {
    if (!user) return;
    
    setImporting(activity.id);
    try {
      const importedActivity = await logActivity({
        userId: user.uid,
        eventId: eventId.toString(),
        distance: activity.distance / 1000, // Convert meters to km
        hours: Math.floor(activity.moving_time / 3600),
        minutes: Math.floor((activity.moving_time % 3600) / 60),
        duration: activity.moving_time,
        location: [activity.location_city, activity.location_country].filter(Boolean).join(', ') || 'Unknown location',
        notes: '',
        images: [],
        stravaActivityId: activity.id.toString(),
        elevationGain: activity.total_elevation_gain,
        averageHeartRate: activity.average_heartrate,
        maxHeartRate: activity.max_heartrate
      });

      // Update imported activities map
      setImportedActivities(prev => new Map(prev.set(activity.id.toString(), {
        ...importedActivity,
        stravaData: activity,
        isImported: true
      })));

      toast({
        title: "Run Imported Successfully!",
        description: `${activity.name} has been imported. You can now add a reflection.`,
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => startReflection(importedActivity.id!)}
          >
            Add Reflection
          </Button>
        ),
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(null);
    }
  };

  const startReflection = (activityId: string) => {
    const existingReflection = reflections.get(activityId);
    if (existingReflection) {
      setReflections(prev => new Map(prev.set(activityId, {
        ...existingReflection,
        isEditing: true
      })));
    } else {
      setReflections(prev => new Map(prev.set(activityId, {
        activityId,
        content: '',
        isEditing: true,
        originalContent: ''
      })));
    }
  };

  const handleReflectionChange = (activityId: string, content: string) => {
    setReflections(prev => {
      const current = prev.get(activityId);
      if (!current) return prev;
      
      return new Map(prev.set(activityId, {
        ...current,
        content
      }));
    });
  };

  const saveReflection = async (activityId: string, content: string, showToast = true) => {
    try {
      // Check if any uploads are still in progress
      if (uploadingImages[activityId]) {
        throw new Error('Please wait for image uploads to complete before saving');
      }

      // Update the activity in the database
      const activity = Array.from(importedActivities.values()).find(a => a.id === activityId);
      if (!activity) return;

      // Update the activity in the database
      const updatedActivity = {
        ...activity,
        notes: content.trim(),
        images: activity.images || []
      };

      // Verify all image URLs are valid
      if (updatedActivity.images.some(img => !img.startsWith('http'))) {
        throw new Error('Some images are still uploading. Please try again.');
      }

        const response = await fetch(`/api/activities/${activityId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          notes: content.trim(),
          images: activity.images || []
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save activity');
      }

      // Update the imported activities map with the full updated activity
      setImportedActivities(prev => {
        const newMap = new Map(prev);
        newMap.set(activity.stravaActivityId!, updatedActivity);
        return newMap;
      });
      
      setReflections(prev => {
        const current = prev.get(activityId);
        if (!current) return prev;
        
        return new Map(prev.set(activityId, {
          ...current,
          isEditing: false,
          originalContent: content.trim()
        }));
      });

      // Update imported activities map with new notes
      setImportedActivities(prev => {
        const newMap = new Map(prev);
        const activity = newMap.get(activityId);
        if (activity) {
          newMap.set(activityId, {
            ...activity,
            notes: content.trim()
          });
        }
        return newMap;
      });

      if (showToast) {
        toast({
          title: "Reflection Saved",
          description: "Your prayer reflection has been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save reflection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelReflectionEdit = (activityId: string) => {
    const reflection = reflections.get(activityId);
    if (!reflection) return;

    if (reflection.originalContent) {
      setReflections(prev => new Map(prev.set(activityId, {
        ...reflection,
        content: reflection.originalContent,
        isEditing: false
      })));
    } else {
      setReflections(prev => {
        const newMap = new Map(prev);
        newMap.delete(activityId);
        return newMap;
      });
    }
  };

  const deleteReflection = (activityId: string) => {
    const reflection = reflections.get(activityId);
    if (!reflection) return;

    // Store for undo functionality
    setDeletedReflections(prev => [...prev, {
      activityId,
      content: reflection.content,
      timestamp: Date.now()
    }]);

    setReflections(prev => {
      const newMap = new Map(prev);
      newMap.delete(activityId);
      return newMap;
    });

    toast({
      title: "Reflection Deleted",
      description: "Your reflection has been deleted.",
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => undoDeleteReflection(activityId)}
        >
          <Undo2 className="h-4 w-4 mr-1" />
          Undo
        </Button>
      ),
    });
  };

  const undoDeleteReflection = (activityId: string) => {
    const deletedReflection = deletedReflections.find(d => d.activityId === activityId);
    if (!deletedReflection) return;

    setReflections(prev => new Map(prev.set(activityId, {
      activityId,
      content: deletedReflection.content,
      isEditing: false,
      originalContent: deletedReflection.content
    })));

    setDeletedReflections(prev => prev.filter(d => d.activityId !== activityId));

    toast({
      title: "Reflection Restored",
      description: "Your reflection has been restored.",
    });
  };

  const deleteImportedActivity = async (activityId: string) => {
    try {
      await deleteActivity(activityId);
      
      // Remove from imported activities
      const stravaId = Array.from(importedActivities.entries())
        .find(([_, activity]) => activity.id === activityId)?.[0];
      
      if (stravaId) {
        setImportedActivities(prev => {
          const newMap = new Map(prev);
          newMap.delete(stravaId);
          return newMap;
        });
      }

      // Remove reflection if exists
      setReflections(prev => {
        const newMap = new Map(prev);
        newMap.delete(activityId);
        return newMap;
      });

      toast({
        title: "Activity Deleted",
        description: "The imported activity has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete activity. Please try again.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold tracking-tight text-red-700">Connection Error</h2>
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stravaStatus?.connected) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">🏃‍♂️ Connect with Strava</h2>
            <p className="text-muted-foreground">
              Connect your Strava account to automatically import your activities and add prayer reflections to each run.
            </p>
            <div className="flex justify-center pt-4">
              <StravaConnect onStatusChange={setStravaStatus} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">🏃‍♂️ Strava + Prayer Integration</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  Connect your Strava account to automatically import your activities and add prayer reflections to each run. 
                  This creates a powerful connection between your physical fitness and spiritual growth.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="default" className="text-sm px-3 py-1.5 bg-blue-100 text-blue-800">
                  <span className="font-semibold">{importedActivities.size}</span> imported runs
                </Badge>
                <Separator orientation="vertical" className="h-5" />
                <p className="text-sm text-muted-foreground">
                  {stravaActivities.length} available runs
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

      <ScrollArea className="h-[550px] pr-4">
        <div className="space-y-4">
          {stravaActivities.map((activity) => {
            const isImported = importedActivities.has(activity.id.toString());
            const importedActivity = importedActivities.get(activity.id.toString());
            const reflection = importedActivity ? reflections.get(importedActivity.id!) : null;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <Card className={`transition-all duration-200 ${
                  isImported ? 'border-green-200 bg-green-50/50 shadow-md' : 'hover:bg-muted/50'
                }`}>
                  <CardContent className="p-6">
                    {/* Activity Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center gap-2">
                          {isImported && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{activity.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(activity.start_date_local), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isImported ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Imported
                            </Badge>
                            {!reflection?.content && (
                              <Button
                                onClick={() => startReflection(importedActivity!.id!)}
                                className="gap-2"
                              >
                                <Plus className="h-4 w-4" />
                                Add Reflection
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDeleteDialog(importedActivity!.id!)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleImport(activity)}
                            disabled={importing === activity.id}
                            className="gap-2"
                          >
                            {importing === activity.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                Importing...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4" />
                                Import & Reflect
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Activity Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Distance</p>
                          <p className="font-semibold">{(activity.distance / 1000).toFixed(2)} km</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="font-semibold">{formatTime(activity.moving_time)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Pace</p>
                          <p className="font-semibold">{formatPace(activity.average_speed)}/km</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Elevation</p>
                          <p className="font-semibold">{Math.round(activity.total_elevation_gain)}m</p>
                        </div>
                      </div>
                    </div>

                    {/* Reflection Section */}
                    {isImported && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4"
                        >
                          <Separator className="mb-4" />
                          
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-primary" />
                                <h4 className="font-semibold text-primary">Prayer Reflection</h4>
                              </div>
                              
                              {reflection && !reflection.isEditing && (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startReflection(importedActivity!.id!)}
                                  >
                                    <Edit3 className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteReflection(importedActivity!.id!)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                              {(importedActivity?.images?.length || 0) > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {importedActivity?.images?.map((img: string, i: number) => (
                                    <a 
                                      key={i} 
                                      href={img} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="block w-24 h-24 rounded-md overflow-hidden border"
                                    >
                                      <img 
                                        src={img} 
                                        alt={`Activity image ${i+1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>

                            {reflection?.isEditing ? (
                              <div className="space-y-3">
                                <Textarea
                                  value={reflection.content}
                                  onChange={(e) => handleReflectionChange(importedActivity!.id!, e.target.value)}
                                  placeholder="Share your spiritual insights from this run... How did God speak to you? What did you learn? What are you grateful for?"
                                  className="min-h-[120px] bg-white"
                                  autoFocus
                                />
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-muted-foreground">
                                    Changes must be manually saved
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => cancelReflectionEdit(importedActivity!.id!)}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => saveReflection(importedActivity!.id!, reflection.content)}
                                      disabled={!reflection.content.trim()}
                                    >
                                      <Save className="h-4 w-4 mr-1" />
                                      Save
                                    </Button>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                                    Add Images (max 5)
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={async (e) => {
                                      const files = Array.from(e.target.files || []);
                                      if (!files.length) return;
                                      
                                      const activityId = importedActivity!.id!;
                                      const userId = importedActivity!.userId!;
                                      setUploadingImages(prev => ({...prev, [activityId]: true}));
                                      
                                      try {
                                        setUploadingImages(prev => ({...prev, [activityId]: true}));
                                        
                                        const newImages = await Promise.all(
                                          files.map(file => 
                                            uploadActivityImage(file, userId, activityId)
                                          )
                                        );
                                        
                                        if (!importedActivity) return;
                                        
                                        // Update activity with new images
                                        const updatedActivity: ImportedActivity = {
                                          ...importedActivity,
                                          images: [...(importedActivity.images || []), ...newImages].slice(0, 5)
                                        };

                                        // Force update the imported activities map
                                        setImportedActivities(prev => {
                                          const newMap = new Map(prev);
                                          newMap.set(importedActivity.stravaActivityId!, updatedActivity);
                                          return newMap;
                                        });
                                        
                                        await fetch(`/api/activities/${activityId}`, {
                                          method: 'PATCH',
                                          headers: {
                                            'Content-Type': 'application/json',
                                          },
                                          body: JSON.stringify({
                                            images: updatedActivity.images
                                          })
                                        });
                                        
                                        // Update imported activities map
                                        setImportedActivities(prev => {
                                          const newMap = new Map(prev);
                                          newMap.set(importedActivity.stravaActivityId!, updatedActivity);
                                          return newMap;
                                        });
                                        
                                        toast({
                                          title: "Images Uploaded",
                                          description: "Your images have been uploaded successfully",
                                        });
                                      } catch (error: any) {
                                        toast({
                                          title: "Upload Failed",
                                          description: error.message || "Failed to upload images",
                                          variant: "destructive",
                                        });
                                      } finally {
                                        setUploadingImages(prev => ({...prev, [activityId]: false}));
                                      }
                                    }}
                                    disabled={uploadingImages[importedActivity!.id!]}
                                    className="block w-full text-sm text-muted-foreground
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-md file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-primary file:text-primary-foreground
                                      hover:file:bg-primary/90"
                                  />
                                  {uploadingImages[importedActivity!.id!] && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                                      <span>Uploading images... Please wait before saving</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : reflection?.content ? (
                              <div className="bg-white p-4 rounded-md border">
                                <p className="whitespace-pre-line text-sm leading-relaxed">
                                  {reflection.content}
                                </p>
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-muted-foreground mb-3">
                                  No reflection added yet
                                </p>
                                <Button
                                  onClick={() => startReflection(importedActivity!.id!)}
                                  className="gap-2"
                                >
                                  <Plus className="h-4 w-4" />
                                  Add Reflection
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {stravaActivities.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Strava Activities Found</h3>
                <p className="text-muted-foreground">
                  Make sure your Strava account is connected and you have recent running activities.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Imported Activity?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the imported activity and its reflection from your account. 
              The original activity will remain in your Strava account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => showDeleteDialog && deleteImportedActivity(showDeleteDialog)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Activity
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
