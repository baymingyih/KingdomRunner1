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
import { app } from '@/lib/firebase/init'; // Assuming you have firebaseApp initialized

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
      image: undefined, // Changed default to undefined
    },
    mode: "onSubmit"
  });

  const onSubmit = async (data: ActivityFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Form data:", data);

      const storage = getStorage(app);
      const firestoreDb = getFirestore(app);

      let imageUrl = null;
      if (data.image) {
        const imageRef = ref(storage, `activities/${Date.now()}-${data.image.name}`);
        const snapshot = await uploadBytes(imageRef, data.image);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("Image uploaded:", imageUrl);
      }

      const activityData = {
        ...data,
        imageUrl: imageUrl,
        timestamp: new Date(),
      };
      delete activityData.image; // Remove File object before storing in Firestore

      const activitiesCollection = collection(firestoreDb, 'activities');
      const docRef = await addDoc(activitiesCollection, activityData);
      console.log("Activity logged with ID:", docRef.id);

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
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Activity Image (optional)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={isSubmitting}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                          }}
                          {...field}
                        />
                        {value && (
                          <Button
                            type="button"
                            onClick={() => onChange(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {value && (
                        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                          <img
                            src={value instanceof File ? URL.createObjectURL(value) : value}
                            alt="Activity preview"
                            className="h-full w-full object-cover"
                          />
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
