import { getFirestore } from 'firebase/firestore';
import { app } from './init';

// Initialize Firestore
const db = getFirestore(app);

// Enable persistence only in browser and only once
if (typeof window !== 'undefined') {
  // Use dynamic import to ensure this only runs in the browser
  import('firebase/firestore').then(({ enableIndexedDbPersistence }) => {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      }
    });
  });
}

export { db };
