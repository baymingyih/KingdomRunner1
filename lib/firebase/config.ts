import { FirebaseOptions } from 'firebase/app';

// Validate required environment variables
const validateConfig = () => {
  const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];

  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`Missing required Firebase config: ${key}`);
    }
  }
};

// Default configuration for development
const defaultConfig = {
  apiKey: "AIzaSyCopx5Hk7QK3JkyrVU9IWYJuERPn7vH43E",
  authDomain: "kingdomrunnersdv1.firebaseapp.com",
  projectId: "kingdomrunnersdv1",
  storageBucket: "kingdomrunnersdv1.firebasestorage.app",
  messagingSenderId: "626559745548",
  appId: "1:626559745548:web:3e2f5d7498f7e3beb1f829",
  measurementId: "G-0G8N8DZWHW"
};

// Use environment variables if available, otherwise fall back to default config
export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || [
    defaultConfig.authDomain,
    'krstaging.netlify.app'
  ].join(','),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId
};

// Validate config in development
if (process.env.NODE_ENV === 'development') {
  validateConfig();
}
