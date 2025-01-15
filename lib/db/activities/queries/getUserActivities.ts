import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../../../firebase/init';
import { Activity, ActivityError } from '../types';

export async function getUserActivities(userId: string): Promise<Activity[]> {
  if (!userId) {
    throw new ActivityError('User ID is required', 'invalid-input');
  }

  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as Activity[];
  } catch (error) {
    if (error instanceof FirestoreError) {
      throw new ActivityError(
        'Failed to load activities',
        error.code,
        error
      );
    }
    throw new ActivityError(
      'An unexpected error occurred while loading activities',
      'unknown',
      error
    );
  }
}