const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../config/kingdomrunnersdv1-firebase-adminsdk-sasrb-c2f4075ce9.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://kingdomrunnersdv1.firebaseio.com'
});

const db = admin.firestore();

async function deleteAllActivities() {
  try {
    // Get all activity documents
    const activitiesRef = db.collection('activities');
    const snapshot = await activitiesRef.get();
    
    if (snapshot.empty) {
      console.log('No activities found to delete');
      return 0;
    }

    // Batch delete all documents
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Successfully deleted ${snapshot.size} activities`);
    return snapshot.size;
  } catch (error) {
    console.error('Error deleting activities:', error);
    process.exit(1);
  }
}

deleteAllActivities();
