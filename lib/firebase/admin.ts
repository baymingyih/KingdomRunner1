import * as admin from 'firebase-admin';

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
];

const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  throw new Error(`Missing Firebase environment variables: ${missingVars.join(', ')}`);
}

// Check if we're already initialized
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    });
    
    console.log('Firebase Admin SDK initialized successfully');
    console.log('Storage bucket:', admin.storage().bucket().name);
    
    // Log the bucket URL for debugging
    const bucket = admin.storage().bucket();
    console.log('Bucket URL:', `gs://${bucket.name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Firebase Admin SDK initialization failed: ${message}`);
  }
}

// Verify storage initialization
export const adminStorage = (() => {
  const storage = admin.storage();
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }
  return storage;
})();

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
