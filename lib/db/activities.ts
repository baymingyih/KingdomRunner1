import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  addDoc,
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/init';
import { uploadActivityImage } from '../storage/uploadImage';
import { v4 as uuidv4 } from 'uuid';

export interface Activity {
  id?: string;
  userId: string;
  eventId: string;
  distance: number;
  hours: number;
  minutes: number;
  duration: number;  // Required property now
  location: string;
  notes?: string;
  imageUrl?: string;
  timestamp: Date;
  userAvatar?: string;
  userName?: string;
}

export interface ActivityInput {
  userId: string;
  eventId: string;
  distance: string;
  hours: string;
  minutes: string;
  location: string;
  notes?: string;
  image?: File | null;
}

export async function logActivity(input: ActivityInput): Promise<Activity> {
  try {
    let imageUrl: string | undefined;

    // Handle image upload if present
    if (input.image instanceof File) {
      const activityId = uuidv4();
      imageUrl = await uploadActivityImage(input.image, input.userId, activityId);
    }

    // Fetch user data to get the avatar
    const userDoc = await getDoc(doc(db, 'users', input.userId));
    const userData = userDoc.data();
    const userAvatar = userData?.avatar;
    const userName = userData?.name;

    // Create activity data without the File object
    const durationInMinutes = (parseInt(input.hours) || 0) * 60 + (parseInt(input.minutes) || 0);

    const activityData: any = {
      userId: input.userId,
      eventId: input.eventId,
      distance: parseFloat(input.distance),
      hours: parseInt(input.hours) || 0,
      minutes: parseInt(input.minutes) || 0,
      duration: durationInMinutes, // Store total duration in minutes
      location: input.location,
      timestamp: Timestamp.now(),
    };

    // Only add optional fields if they are present
    if (userAvatar !== undefined) {
      activityData.userAvatar = userAvatar;
    }
    if (userName !== undefined) {
      activityData.userName = userName;
    }
    if (input.notes) {
      activityData.notes = input.notes;
    }
    if (imageUrl) {
      activityData.imageUrl = imageUrl;
    }

    const docRef = await addDoc(collection(db, 'activities'), activityData);
    
    return {
      id: docRef.id,
      ...activityData,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error getting user activities:', error);
    throw new Error('Failed to load activities');
  }
}
export async function getEventActivities(eventId: string): Promise<Activity[]> {
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('eventId', '==', eventId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return Promise.all(querySnapshot.docs.map(async docSnapshot => {
      const activityData = docSnapshot.data();
      try {
        const userDoc = await getDoc(doc(db, 'users', activityData.userId));
        const userData = userDoc.data();
        // Calculate duration from hours and minutes
        const durationInMinutes = (activityData.hours || 0) * 60 + (activityData.minutes || 0);
        
        const result: Activity = {
          id: docSnapshot.id,
          userId: activityData.userId,
          eventId: activityData.eventId,
          distance: activityData.distance,
          hours: activityData.hours,
          minutes: activityData.minutes,
          duration: durationInMinutes,
          location: activityData.location,
          timestamp: activityData.timestamp.toDate(),
        };
        
        // Include imageUrl if it exists
        if (activityData.imageUrl) {
          result.imageUrl = activityData.imageUrl;
        }
        
        // Only add user data if it exists
        if (userData?.avatar !== undefined) {
          result.userAvatar = userData.avatar;
        }
        if (userData?.name !== undefined) {
          result.userName = userData.name;
        }
        
        return result;
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Even in the error case, ensure we return a properly formatted activity
        // Calculate duration from hours and minutes
        const durationInMinutes = (activityData.hours || 0) * 60 + (activityData.minutes || 0);
        
        const result: Activity = {
          id: docSnapshot.id,
          userId: activityData.userId,
          eventId: activityData.eventId,
          distance: activityData.distance,
          hours: activityData.hours, 
          minutes: activityData.minutes,
          duration: durationInMinutes,
          location: activityData.location,
          timestamp: activityData.timestamp.toDate(),
        };
        
        // Include imageUrl if it exists
        if (activityData.imageUrl) {
          result.imageUrl = activityData.imageUrl;
        }
        
        // Include notes if they exist
        if (activityData.notes) {
          result.notes = activityData.notes;
        }
        
        return result;
      }
    }));
  } catch (error) {
    console.error('Error getting event activities:', error);
    throw new Error('Failed to load activities for this event');
  }
}

export async function getUserActivities(userId: string): Promise<Activity[]> {
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      // Calculate duration from hours and minutes
      const durationInMinutes = (data.hours || 0) * 60 + (data.minutes || 0);
      
      const result: Activity = {
        id: docSnapshot.id,
        userId: data.userId,
        eventId: data.eventId,
        distance: data.distance,
        hours: data.hours,
        minutes: data.minutes,
        duration: durationInMinutes,
        location: data.location,
        timestamp: data.timestamp.toDate(),
      };
      
      // Include optional fields if they exist
      if (data.imageUrl) {
        result.imageUrl = data.imageUrl;
      }
      if (data.notes) {
        result.notes = data.notes;
      }
      if (data.userAvatar) {
        result.userAvatar = data.userAvatar;
      }
      if (data.userName) {
        result.userName = data.userName;
      }
      
      return result;
    });
  } catch (error) {
    console.error('Error getting user activities:', error);
    throw new Error('Failed to load activities');
  }
}
