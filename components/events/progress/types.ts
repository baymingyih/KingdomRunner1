export interface ProgressStats {
  totalDistance: number;
  targetDistance: number;
  totalActivities: number;
  targetActivities: number;
}

export interface ActivityFormData {
  distance: string;
  duration: string;
  location: string;
  notes?: string;
  image?: File;
}
