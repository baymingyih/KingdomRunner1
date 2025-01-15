import { Timestamp } from 'firebase/firestore';

export interface Activity {
  id?: string;
  userId: string;
  eventId: string;
  distance: number;
  duration: number;
  location: string;
  notes?: string | null;
  timestamp: Date;
}

export interface ActivityInput {
  userId: string;
  eventId: string;
  distance: number | string;
  duration: number | string;
  location: string;
  notes?: string;
}

export interface ActivityData {
  userId: string;
  eventId: string;
  distance: number;
  duration: number;
  location: string;
  notes: string | null;
  timestamp: Timestamp;
}

export class ActivityError extends Error {
  constructor(
    message: string,
    public code: string = 'unknown',
    public originalError?: any
  ) {
    super(message);
    this.name = 'ActivityError';
  }
}