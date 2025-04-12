"use client"

import { forwardRef, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import type { ActivityFormData } from './types';

interface ImageUploadProps {
  form: UseFormReturn<ActivityFormData>;
  disabled?: boolean;
  onChange?: (value: File | null) => void;
  value?: File | null;
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ form, disabled, onChange, value, ...props }, ref) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        form.setValue('images', [file]);
        if (onChange) onChange(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const removeImage = () => {
      form.setValue('images', []);
      if (onChange) onChange(null);
      setPreview(null);
    };

    return (
      <FormField
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Photo (optional)</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={disabled}
                  {...field}
                />
                {preview && (
                  <div className="relative w-full h-48">
                    <Image
                      src={preview}
                      alt="Activity preview"
                      fill
                      className="object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        form.setValue('images', []);
                        setPreview(null);
                        if (onChange) onChange(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
);

ImageUpload.displayName = 'ImageUpload';
