import { Timestamp } from 'firebase/firestore';
import type { ActivityInput, ActivityData } from '../types';

export function formatActivityData(input: ActivityInput): ActivityData {
  return {
    userId: input.userId.trim(),
    eventId: input.eventId.trim(),
    distance: normalizeNumber(input.distance),
    duration: normalizeNumber(input.duration),
    location: input.location.trim(),
    notes: input.notes?.trim() || null,
    timestamp: Timestamp.now()
  };
}

function normalizeNumber(value: number | string): number {
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      throw new Error('Invalid numeric value');
    }
    return parsed;
  }
  return value;
}