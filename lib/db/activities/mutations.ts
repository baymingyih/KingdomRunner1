import { collection, addDoc, FirestoreError } from 'firebase/firestore';
import { db } from '../../firebase/init';
import { Activity, ActivityInput, ActivityError } from './types';
import { validateActivityInput, ValidationError } from './validation';
import { formatActivityData } from './utils/formatters';

export async function logActivity(input: ActivityInput): Promise<Activity> {
  try {
    // Validate input
    validateActivityInput(input);

    // Format activity data
    const activityData = formatActivityData(input);

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'activities'), activityData);
    
    return {
      id: docRef.id,
      ...activityData,
      timestamp: activityData.timestamp.toDate()
    };
  } catch (error) {
    console.error('Error logging activity:', error);
    
    if (error instanceof FirestoreError) {
      switch (error.code) {
        case 'permission-denied':
          throw new ActivityError('You do not have permission to log activities', error.code, error);
        case 'unauthenticated':
          throw new ActivityError('Please sign in to log activities', error.code, error);
        case 'invalid-argument':
          throw new ActivityError('Invalid data provided. Please check your input.', error.code, error);
        default:
          throw new ActivityError('Failed to save activity', error.code, error);
      }
    }
    
    if (error instanceof ValidationError) {
      throw new ActivityError(error.message, 'validation-error', error);
    }
    
    throw new ActivityError(
      error instanceof Error ? error.message : 'Failed to log activity',
      'unknown',
      error
    );
  }
}
