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
      images: []
    },
    mode: "onSubmit"
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImageChange = (files: File[]) => {
    // Clean up old preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // Create new preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    
    return files;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share a new activity</CardTitle>
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
                  <FormLabel>Reflection</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your reflections..."
                      disabled={submitting}
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
                          disabled={submitting}
                          onChange={(e) => {
                            const newFiles = Array.from(e.target.files || []);
                            const updatedFiles = [...value, ...newFiles];
                            onChange(updatedFiles);
                            handleImageChange(updatedFiles);
                          }}
                          {...field}
                        />
                        {value.length > 0 && (
                          <Button
                            type="button"
                            className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
                            onClick={() => {
                              onChange([]);
                              handleImageChange([]);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {previewUrls.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {value.map((file: File, index: number) => (
                            <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                              <img
                                src={previewUrls[index]}
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
                                  
                                  const newPreviewUrls = [...previewUrls];
                                  URL.revokeObjectURL(newPreviewUrls[index]);
                                  newPreviewUrls.splice(index, 1);
                                  setPreviewUrls(newPreviewUrls);
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
              disabled={submitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sharing activity...
                </>
              ) : (
                'Share a new activity'
              )}
            </Button>
          </div>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
