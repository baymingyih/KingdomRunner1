import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Load the service account key
const serviceAccountPath = path.resolve(__dirname, '../config/kingdomrunnersdv1-firebase-adminsdk-sasrb-c2f4075ce9.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Load the CORS configuration
const corsConfigPath = path.resolve(__dirname, '../cors.json');
const corsConfig = JSON.parse(fs.readFileSync(corsConfigPath, 'utf8'));

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'kingdomrunnersdv1'
  });
  
  // Log the bucket name for debugging
  console.log('Using storage bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'kingdomrunnersdv1');
}

async function configureCors() {
  try {
    const bucket = admin.storage().bucket();
    
    console.log('Applying CORS configuration to Firebase Storage bucket...');
    console.log('CORS Config:', JSON.stringify(corsConfig, null, 2));
    
    await bucket.setCorsConfiguration(corsConfig);
    
    console.log('CORS configuration applied successfully!');
    
    // Verify the configuration
    const [metadata] = await bucket.getMetadata();
    console.log('Current CORS configuration:', JSON.stringify(metadata.cors, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error configuring CORS:', error);
    throw error;
  }
}

configureCors()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to configure CORS:', error);
    process.exit(1);
  });
