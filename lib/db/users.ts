import { 
  collection, 
  doc,
  getDoc,
  getDocs, 
  query, 
  where, 
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/init';

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  totalDistance: number;
  totalPrayers: number;
  createdAt: Date;
}

export async function getUser(uid: string): Promise<UserProfile | null> {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    return {
      id: userDoc.id,
      ...userData,
      createdAt: userData.createdAt.toDate(),
    } as UserProfile;
  } catch (error) {
    console.error('Error getting user:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get user profile');
  }
}

export async function createUser(userData: Omit<UserProfile, 'id' | 'createdAt' | 'totalDistance' | 'totalPrayers'>): Promise<UserProfile> {
  try {
    // Check if user already exists
    const existingUser = await getUser(userData.uid);
    if (existingUser) {
      throw new Error('User profile already exists');
    }

    // Add new user with initial values
    const newUser = {
      ...userData,
      totalDistance: 0,
      totalPrayers: 0,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'users'), newUser);
    
    return {
      id: docRef.id,
      ...newUser,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create user profile');
  }
}