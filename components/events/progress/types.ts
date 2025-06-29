export interface ProgressStats {
  totalDistance: number;
  targetDistance: number;
  totalActivities: number;
  targetActivities: number;
}

export interface ActivityFormData {
  activityType: string;
  activityDate: string;
  activityTime: string;
  distance: string;
  hours: string;
  minutes: string;
  location: string;
  notes?: string;
  images?: File[];
}