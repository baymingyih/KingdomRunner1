import admin from 'firebase-admin';
import { getApp } from 'firebase/app';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  const app = getApp();
  const serviceAccount = require('../../../firebase.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: app.options.storageBucket,
  });
}

export async function checkCorsConfig() {
  try {
    const bucket = admin.storage().bucket();
    const [metadata] = await bucket.getMetadata();
    const corsConfig = metadata.cors;

    return {
      configured: !!corsConfig,
      config: corsConfig || null,
    };
  } catch (error) {
    console.error('Error checking CORS:', error);
    throw error;
  }
}
