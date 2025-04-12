export interface ProgressStats {
  totalDistance: number;
  targetDistance: number;
  totalActivities: number;
  targetActivities: number;
}

export interface ActivityFormData {
  distance: string;
  hours: string;
  minutes: string;
  location: string;
  notes?: string;
  images?: File[];
}
