import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import corsConfig from '../../../cors.json';
import * as fs from 'fs';

// Initialize Firebase Admin SDK
const serviceAccountKey = JSON.parse(fs.readFileSync('./firebase-admin.json', 'utf8'));

const adminApp = initializeApp({
  credential: cert(serviceAccountKey),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export async function GET() {
  try {
    const storage = getStorage(adminApp);
    const bucket = storage.bucket();

    await (bucket as any).setCors([
      {
        origin: corsConfig[0].origin,
        method: corsConfig[0].method,
        maxAgeSeconds: corsConfig[0].maxAgeSeconds,
        responseHeader: corsConfig[0].responseHeader,
      },
    ]);

    console.log('CORS configuration applied successfully');
    return new Response(JSON.stringify({ message: 'CORS configured successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Error configuring CORS:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
