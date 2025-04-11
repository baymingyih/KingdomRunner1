import * as admin from 'firebase-admin';

// Check if we're already initialized
if (!admin.apps.length) {
  try {
    // Use environment variables for the service account
    // Use environment variables directly
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // You would need to add this
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') // You would need to add this
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
    
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
}

export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
export const adminFirestore = admin.firestore();
