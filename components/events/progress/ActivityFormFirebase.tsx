"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormProvider } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { activitySchema } from '@/lib/schemas/activity'; // Assuming you have a schema
import type { ActivityFormData } from './types'; // Assuming you have types

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { logActivity } from '@/lib/db/activities';
import { app } from '@/lib/firebase/init';

interface ActivityFormFirebaseProps {
  onSubmitSuccess?: () => void; // Optional callback for successful submission
  onError?: (error: Error) => void; // Optional callback for errors
}

export function ActivityFormFirebase({ onSubmitSuccess, onError }: ActivityFormFirebaseProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      distance: '',
      hours: '',
      minutes: '',
      location: '',
      notes: '',
      images: []
    },
    mode: "onSubmit"
  });

  const onSubmit = async (data: ActivityFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Form data:", data);

      // Get user ID and event ID (you'll need to get these from your auth context or props)
      const userId = "user123"; // Replace with actual user ID
      const eventId = "event123"; // Replace with actual event ID

      // Prepare activity input
      const activityInput = {
        userId,
        eventId,
        distance: data.distance,
        hours: data.hours || "0",
        minutes: data.minutes,
        location: data.location,
        notes: data.notes,
        images: data.images
      };

      // Log the activity using our function
      const result = await logActivity(activityInput);
      console.log("Activity logged with ID:", result.id);

      setIsSubmitting(false);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Form submission failed'));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Activity (Firebase)</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="5.0"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <FormField
                name="hours"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Hours (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="minutes"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Where did you run?"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience..."
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="images"
              render={({ field: { value = [], onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Activity Images (optional)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          disabled={isSubmitting}
                          onChange={(e) => {
                            const newFiles = Array.from(e.target.files || []);
                            const updatedFiles = [...value, ...newFiles];
                            onChange(updatedFiles);
                          }}
                          {...field}
                        />
                        {value.length > 0 && (
                          <Button
                            type="button"
                            onClick={() => onChange([])}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {value.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {value.map((file: File, index: number) => (
                            <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-background hover:bg-accent flex items-center justify-center"
                                onClick={() => {
                                  const newFiles = [...value];
                                  newFiles.splice(index, 1);
                                  onChange(newFiles);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging Activity...
                </>
              ) : (
                'Log Activity'
              )}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
