import { 
  collection, 
  doc,
  getDoc,
  getDocs, 
  query, 
  where, 
  setDoc,
  updateDoc,
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
  isAdmin?: boolean; // New admin field
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

export async function createUser(userData: Omit<UserProfile, 'id' | 'createdAt' | 'totalDistance' | 'totalPrayers' | 'isAdmin'>): Promise<UserProfile> {
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
      isAdmin: false, // Default to false for new users
      createdAt: Timestamp.now()
    };

    const userRef = doc(db, 'users', userData.uid);
    await setDoc(userRef, newUser);
    
    return {
      id: userData.uid,
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

export async function updateUserAdminStatus(uid: string, isAdmin: boolean): Promise<UserProfile | null> {
  try {
    if (!uid) {
      throw new Error('User ID is required');
    }

    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { isAdmin });
    
    // Return updated user
    return await getUser(uid);
  } catch (error) {
    console.error('Error updating user admin status:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update user admin status');
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as UserProfile[];
  } catch (error) {
    console.error('Error getting all users:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get users');
  }
}

export async function getAdminUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('isAdmin', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as UserProfile[];
  } catch (error) {
    console.error('Error getting admin users:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get admin users');
  }
}