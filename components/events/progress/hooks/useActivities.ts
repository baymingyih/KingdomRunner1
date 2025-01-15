"use client"

import { useState, useEffect } from 'react';
import { getUserActivities } from '@/lib/db/activities';
import type { Activity } from '@/lib/db/activities/types';

export function useActivities(userId: string | undefined) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const data = await getUserActivities(userId);
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load activities'));
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [userId]);

  return { activities, loading, error };
}