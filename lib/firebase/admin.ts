import * as admin from 'firebase-admin';

// Check if we're already initialized
if (!admin.apps.length) {
  try {
    // Use environment variables for the service account
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
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
