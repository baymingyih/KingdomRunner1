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
  duration: number;
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
  duration: string;
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
    const activityData: any = {
      userId: input.userId,
      eventId: input.eventId,
      distance: parseFloat(input.distance),
      duration: parseFloat(input.duration),
      location: input.location,
      timestamp: Timestamp.now(),
      userAvatar: userAvatar,
      userName: userName,
    };

    // Only add optional fields if they are present
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
    console.error('Error logging activity:', error);
    throw new Error('Failed to log activity');
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
        return {
          id: docSnapshot.id,
          ...activityData,
          timestamp: activityData.timestamp.toDate(),
          userAvatar: userData?.avatar,
          userName: userData?.name,
        } as Activity;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return {
          id: docSnapshot.id,
          ...activityData,
          timestamp: activityData.timestamp.toDate(),
        } as Activity;
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
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as Activity[];
  } catch (error) {
    console.error('Error getting user activities:', error);
    throw new Error('Failed to load activities');
  }
}
