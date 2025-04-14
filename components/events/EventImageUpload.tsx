"use client"

import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { uploadEventImage } from '@/lib/storage/uploadEventImage';

interface EventImageUploadProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
  eventId: string;
  currentImage?: string;
}

export function EventImageUpload({ form, disabled, eventId, currentImage }: EventImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Firebase
        const downloadURL = await uploadEventImage(file, eventId);
        form.setValue('image', downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
        form.setError('image', { message: 'Failed to upload image' });
      } finally {
        setIsUploading(false);
      }
    };

    const removeImage = () => {
      form.setValue('image', '');
      setPreview(null);
    };

    return (
      <FormField
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Cover Image</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Input
                  id="event-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={disabled || isUploading}
                />
                {preview && (
                  <div className="relative w-full h-64 rounded-md overflow-hidden">
                    <Image
                      src={preview}
                      alt="Event cover preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 h-10 w-10 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                      onClick={removeImage}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
}

EventImageUpload.displayName = 'EventImageUpload';
