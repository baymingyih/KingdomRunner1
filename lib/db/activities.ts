import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  deleteDoc,
  limit as limitQuery
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
  imageUrls?: string[];
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
  images?: File[];
}

export async function logActivity(input: ActivityInput): Promise<Activity> {
  try {
    let imageUrl: string | undefined;
    let imageUrls: string[] = [];

    // Handle single image upload if present
    if (input.image instanceof File) {
      const activityId = uuidv4();
      try {
        imageUrl = await uploadActivityImage(input.image, input.userId, activityId);
      } catch (error) {
        console.warn('Error uploading image, continuing without image:', error);
      }
    }

    // Handle multiple image uploads if present
    if (input.images && input.images.length > 0) {
      const activityId = uuidv4();
      try {
        const uploadPromises = input.images.map(async (image, index) => {
          return await uploadActivityImage(image, input.userId, `${activityId}-${index}`);
        });
        imageUrls = await Promise.all(uploadPromises);
      } catch (error) {
        console.warn('Error uploading multiple images, continuing without images:', error);
      }
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
    if (imageUrls.length > 0) {
      activityData.imageUrls = imageUrls;
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
        
        // Include imageUrl and imageUrls if they exist
        if (activityData.imageUrl) {
          result.imageUrl = activityData.imageUrl;
        }
        if (activityData.imageUrls) {
          result.imageUrls = activityData.imageUrls;
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
        
        // Include imageUrl and imageUrls if they exist
        if (activityData.imageUrl) {
          result.imageUrl = activityData.imageUrl;
        }
        if (activityData.imageUrls) {
          result.imageUrls = activityData.imageUrls;
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

export async function deleteActivity(activityId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'activities', activityId));
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw new Error('Failed to delete activity');
  }
}

export async function getAllActivities(limit: number = 10): Promise<Activity[]> {
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      orderBy('timestamp', 'desc'),
      limitQuery(limit)
    );
    
    const querySnapshot = await getDocs(q);
    
    const activities = querySnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      
      // Check if required fields exist
      if (!data.userId || !data.eventId || !data.location) {
        return null; // Skip this document
      }
      
      // Calculate duration from hours and minutes
      const durationInMinutes = (data.hours || 0) * 60 + (data.minutes || 0);
      
      // Handle missing or invalid timestamp
      let timestamp = new Date();
      try {
        if (data.timestamp && typeof data.timestamp.toDate === 'function') {
          timestamp = data.timestamp.toDate();
        } else if (data.timestamp) {
          timestamp = new Date(data.timestamp);
        }
      } catch (error) {
        // Use current date if timestamp parsing fails
      }
      
      const result: Activity = {
        id: docSnapshot.id,
        userId: data.userId,
        eventId: data.eventId,
        distance: data.distance || 0,
        hours: data.hours || 0,
        minutes: data.minutes || 0,
        duration: durationInMinutes,
        location: data.location,
        timestamp: timestamp,
      };
      
      // Include optional fields if they exist
      if (data.imageUrl) {
        result.imageUrl = data.imageUrl;
      }
      if (data.imageUrls) {
        result.imageUrls = data.imageUrls;
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
    
    // Filter out any null values
    return activities.filter((activity): activity is Activity => activity !== null);
  } catch (error) {
    console.error('Error getting all activities:', error);
    throw new Error('Failed to load activities');
  }
}

export async function getUserActivities(userId: string): Promise<Activity[]> {
  try {
    // Create a query to get activities for this user
    const activitiesRef = collection(db, 'activities');
    const q = query(
      activitiesRef,
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    const activities = querySnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      
      // Check if required fields exist
      if (!data.userId || !data.eventId || !data.location) {
        return null; // Skip this document
      }
      
      // Calculate duration from hours and minutes
      const durationInMinutes = (data.hours || 0) * 60 + (data.minutes || 0);
      
      // Handle missing or invalid timestamp
      let timestamp = new Date();
      try {
        if (data.timestamp && typeof data.timestamp.toDate === 'function') {
          timestamp = data.timestamp.toDate();
        } else if (data.timestamp) {
          timestamp = new Date(data.timestamp);
        }
      } catch (error) {
        // Use current date if timestamp parsing fails
      }
      
      const result: Activity = {
        id: docSnapshot.id,
        userId: data.userId,
        eventId: data.eventId,
        distance: data.distance || 0,
        hours: data.hours || 0,
        minutes: data.minutes || 0,
        duration: durationInMinutes,
        location: data.location,
        timestamp: timestamp,
      };
      
      // Include optional fields if they exist
      if (data.imageUrl) {
        result.imageUrl = data.imageUrl;
      }
      if (data.imageUrls) {
        result.imageUrls = data.imageUrls;
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
    
    // Filter out any null values
    return activities.filter((activity): activity is Activity => activity !== null);
  } catch (error) {
    console.error('Error getting user activities:', error);
    throw new Error('Failed to load activities');
  }
}
