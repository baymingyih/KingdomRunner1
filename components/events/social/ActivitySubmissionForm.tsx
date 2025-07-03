"use client"

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Timer, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Activity, ActivityInput } from '@/lib/db/activities';
import { ACTIVITY_TYPES } from '@/lib/schemas/activity';
import type { ActivityType } from '@/lib/schemas/activity';

interface ActivitySubmissionFormProps {
  eventId: string;
  initialActivity?: Activity;
  onSubmit: (data: ActivityInput) => Promise<any>;
  autoFocus?: boolean;
}

export function ActivitySubmissionForm({ 
  eventId, 
  initialActivity, 
  onSubmit,
  autoFocus = false
}: ActivitySubmissionFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(!!initialActivity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>('Run');
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [activityTime, setActivityTime] = useState('00:00');
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('');
  const [location, setLocation] = useState(initialActivity?.location || '');
  const [notes, setNotes] = useState(initialActivity?.notes || '');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      return; // Basic validation
    }
    
    setIsSubmitting(true);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const activityData: ActivityInput = {
        userId: user.uid,
        eventId,
        activityType,
        activityDate,
        activityTime,
        distance: parseFloat(distance),
        hours: parseInt(hours),
        minutes: parseInt(minutes),
        duration: parseInt(hours) * 60 + parseInt(minutes),
        location,
        notes: notes || undefined,
        images: images.length > 0 ? images : []
      };
      
      await onSubmit(activityData);
      
      // Show success but keep form open with current values
      toast({
        title: "Reflection saved",
        description: "You can continue editing or close the form.",
      });
    } catch (error) {
      console.error('Error submitting activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Share Your Run</CardTitle>
      </CardHeader>
      <CardContent>
        {!isExpanded ? (
          <Button 
            onClick={() => setIsExpanded(true)}
            className="w-full"
          >
            Share a new activity
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="activityType">Activity Type</Label>
                <select
                  id="activityType"
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as ActivityType)}
                  className="w-full p-2 border rounded"
                >
                  {ACTIVITY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="activityDate">Date</Label>
                <Input
                  id="activityDate"
                  type="date"
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="activityTime">Time</Label>
                <Input
                  id="activityTime"
                  type="time"
                  value={activityTime}
                  onChange={(e) => setActivityTime(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input
                  id="location"
                  placeholder="Where did you run?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                </div>
              </div>
            
              <div>
                <Label htmlFor="notes">Reflection</Label>
                <Textarea
                  id="notes"
                  placeholder="What did you learn from this run? How did it impact you spiritually or emotionally? Share your thoughts..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[150px]"
                  autoFocus={autoFocus}
                />
              </div>
            
              <div>
                <Label htmlFor="images">Photos (optional)</Label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    </label>
                  </div>
                </div>
                
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                    </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                onClick={() => setIsExpanded(false)}
                variant="outline"
                className="text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !location}
                variant={isSubmitting ? "outline" : "default"}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Reflection'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
