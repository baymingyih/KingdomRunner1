const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCopx5Hk7QK3JkyrVU9IWYJuERPn7vH43E",
  authDomain: "kingdomrunnersdv1.firebaseapp.com",
  projectId: "kingdomrunnersdv1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkEvents() {
  try {
    const eventsCol = collection(db, 'events');
    const snapshot = await getDocs(eventsCol);
    
    console.log(`Found ${snapshot.size} events:`);
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });

    if (snapshot.size === 0) {
      console.log('No events found in Firestore. This explains the 404 error.');
    }
  } catch (err) {
    console.error('Error checking events:', err);
  }
}

checkEvents();
