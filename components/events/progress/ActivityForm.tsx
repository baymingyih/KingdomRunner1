"use client"

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { activitySchema } from '@/lib/schemas/activity';
import type { ActivityFormData } from './types';

interface ActivityFormProps {
  onSubmit: (data: ActivityFormData) => Promise<void>;
  submitting: boolean;
}

export function ActivityForm({ onSubmit, submitting }: ActivityFormProps) {
  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      distance: '',
      hours: '',
      minutes: '',
      location: '',
      notes: '',
      image: undefined
    },
    mode: "onSubmit"
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Activity</CardTitle>
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
                      disabled={submitting}
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
                    <FormLabel>Time taken (Hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        disabled={submitting}
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
                        disabled={submitting}
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
                      disabled={submitting}
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
                      disabled={submitting}
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
                          disabled={submitting}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            onChange(handleImageChange(file));
                          }}
                          {...field}
                        />
                        {value && (
                          <Button
                            type="button"
                            className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
                            onClick={() => {
                              onChange(handleImageChange(null));
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
              disabled={submitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging Activity...
                </>
              ) : (
                'Log Activity'
              )}
            </Button>
          </div>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
