import { ActivityInput } from './types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateActivityInput(input: ActivityInput): void {
  if (!input.userId?.trim()) {
    throw new ValidationError('User ID is required');
  }
  
  if (!input.eventId?.trim()) {
    throw new ValidationError('Event ID is required');
  }
  
  const distance = typeof input.distance === 'string' ? parseFloat(input.distance) : input.distance;
  if (isNaN(distance) || distance <= 0) {
    throw new ValidationError('Distance must be a positive number');
  }
  
  const duration = typeof input.duration === 'string' ? parseInt(input.duration.toString()) : input.duration;
  if (isNaN(duration) || duration <= 0) {
    throw new ValidationError('Duration must be a positive number');
  }
  
  if (!input.location?.trim()) {
    throw new ValidationError('Location is required');
  }
  
  if (input.notes && input.notes.length > 500) {
    throw new ValidationError('Notes must be less than 500 characters');
  }
}