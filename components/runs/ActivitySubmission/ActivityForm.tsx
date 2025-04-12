"use client"

"use client"

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, X } from 'lucide-react';
import { activitySchema } from '@/lib/schemas/activity';
import { logActivity } from '@/lib/db/activities';

type ActivityFormData = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  eventId: string;
  userId: string;
  onSuccess: () => void;
}

export function ActivityForm({ eventId, userId, onSuccess }: ActivityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      distance: 0,
      hours: '',
      minutes: 0,
      location: '',
      notes: '',
      images: []
    }
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (file: File | null) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    
    return file;
  };

  const onSubmit = async (data: ActivityFormData) => {
    setIsSubmitting(true);
    try {
      await logActivity({
        userId,
        eventId,
        distance: data.distance.toString(),
        hours: data.hours || '0',
        minutes: data.minutes.toString(),
        location: data.location,
        notes: data.notes,
        image: data.images?.[0]
      });
      
      toast({
        title: "Activity logged successfully!",
        description: "Your run has been recorded.",
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Error logging activity",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Run</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <div className="space-y-4">
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
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
                    <Input placeholder="Where did you run?" {...field} />
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="images"
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
                            const file = e.target.files?.[0] || null;
                            if (file) {
                              form.setValue('images', [file]);
                              onChange([file]);
                              handleImageChange(file);
                            } else {
                              form.setValue('images', []);
                              onChange([]);
                              handleImageChange(null);
                            }
                          }}
                          {...field}
                        />
                        {value && (
                          <Button
                            type="button"
                            className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
                            onClick={() => {
                              form.setValue('images', []);
                              onChange([]);
                              handleImageChange(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {previewUrl && (
                        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                          <img
                            src={previewUrl}
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
              onClick={form.handleSubmit(onSubmit)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Activity'
              )}
            </Button>
          </div>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
