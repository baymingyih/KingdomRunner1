const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../config/kingdomrunnersdv1-firebase-adminsdk-sasrb-c2f4075ce9.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://kingdomrunnersdv1.firebaseio.com'
});

const db = admin.firestore();
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(__dirname, '../backups');
const backupPath = path.join(backupDir, `activities-backup-${timestamp}.json`);

async function backupActivities() {
  try {
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Get all activities
    const snapshot = await db.collection('activities').get();
    const activities = [];
    
    snapshot.forEach(doc => {
      activities.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Write to file
    fs.writeFileSync(backupPath, JSON.stringify(activities, null, 2));
    console.log(`Successfully backed up ${activities.length} activities to ${backupPath}`);
    
    return backupPath;
  } catch (error) {
    console.error('Error backing up activities:', error);
    process.exit(1);
  }
}

backupActivities();
