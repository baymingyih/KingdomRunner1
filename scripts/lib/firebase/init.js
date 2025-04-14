"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.auth = exports.db = exports.app = void 0;
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
var auth_1 = require("firebase/auth");
var storage_1 = require("firebase/storage");
var config_1 = require("./config");
// Initialize Firebase only if it hasn't been initialized
var app = (0, app_1.getApps)().length === 0 ? (0, app_1.initializeApp)(config_1.firebaseConfig) : (0, app_1.getApps)()[0];
exports.app = app;
// Initialize Auth with persistence
var auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
// Initialize Firestore
var db = (0, firestore_1.getFirestore)(app);
exports.db = db;
// Initialize Storage
var storage = (0, storage_1.getStorage)(app);
exports.storage = storage;
// Only run in browser context
if (typeof window !== 'undefined') {
    // Set auth persistence
    (0, auth_1.setPersistence)(auth, auth_1.browserLocalPersistence).catch(function (error) {
        console.error('Error setting auth persistence:', error);
    });
    // Enable Firestore offline persistence
    (0, firestore_1.enableIndexedDbPersistence)(db).catch(function (err) {
        if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence enabled in first tab only');
        }
        else if (err.code === 'unimplemented') {
            console.warn('Browser does not support persistence');
        }
    });
}
