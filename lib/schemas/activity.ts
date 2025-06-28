import * as z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGES = 5; // Maximum number of images allowed

export const activitySchema = z.object({
  distance: z.string()
    .min(1, 'Distance is required')
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, 'Distance must be greater than 0'),
    
  hours: z.string()
    .optional(),
  minutes: z.string()
    .min(1, 'Minutes are required')
    .transform((val) => parseInt(val))
    .refine((val) => val >= 0, 'Minutes must be a positive number'),

  location: z.string()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),
    
  notes: z.string()
    .optional(),
    
  images: z
    .array(
      z.instanceof(File)
        .refine((file) => file?.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          'Only .jpg, .png and .webp formats are supported'
        )
    )
    .max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`)
    .optional()
    .default([]),

  // Strava-specific fields
  stravaActivityId: z.string().optional(),
  activityType: z.string().optional(),
  elevationGain: z.number().optional(),
  averageHeartRate: z.number().optional(),
  maxHeartRate: z.number().optional()
});

export type ActivityInput = z.infer<typeof activitySchema>;
