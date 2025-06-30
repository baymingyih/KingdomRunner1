import { db } from '@/lib/firebase';
import { collection, query, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Event } from '@/lib/data/events';

export async function getEvents(): Promise<Event[]> {
  try {
    const q = query(collection(db, 'events'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Event : null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
}

export async function updateEvent(event: Event): Promise<void> {
  try {
    const { id, ...eventData } = event;
    const docRef = doc(db, 'events', id);
    await updateDoc(docRef, eventData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'events', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}
