"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminFirestore = exports.adminAuth = exports.adminStorage = void 0;
var admin = require("firebase-admin");
// Validate required environment variables
var requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
];
var missingVars = requiredEnvVars.filter(function (v) { return !process.env[v]; });
if (missingVars.length > 0) {
    throw new Error("Missing Firebase environment variables: ".concat(missingVars.join(', ')));
}
// Check if we're already initialized
if (!admin.apps.length) {
    try {
        var privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            }),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        });
        console.log('Firebase Admin SDK initialized successfully');
        console.log('Storage bucket:', admin.storage().bucket().name);
        // Log the bucket URL for debugging
        var bucket = admin.storage().bucket();
        console.log('Bucket URL:', "gs://".concat(bucket.name));
    }
    catch (error) {
        var message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error("Firebase Admin SDK initialization failed: ".concat(message));
    }
}
// Verify storage initialization
var app = admin.app();
exports.adminStorage = admin.storage();
exports.adminAuth = admin.auth();
exports.adminFirestore = admin.firestore();
if (!app) {
    throw new Error('Firebase Admin app not initialized');
}
exports.default = app;
