import { adminFirestore } from '../lib/firebase/admin.ts';

async function checkEvents() {
  try {
    console.log('Checking events collection...');
    const snapshot = await adminFirestore.collection('events').get();
    
    if (snapshot.empty) {
      console.log('No events found in collection');
      return;
    }

    console.log(`Found ${snapshot.size} events:`);
    snapshot.forEach(doc => {
      console.log(`- ${doc.id}:`, doc.data());
    });
  } catch (error) {
    console.error('Error checking events:', error);
    process.exit(1);
  }
}

checkEvents();
