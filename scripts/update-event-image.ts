import { updateEvent } from '../lib/db/events';

async function updateEventImage() {
  const eventId = '1';
  const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/kingdomrunnersdv1/o/events%2F1%2Fcover%2F1744597774563-WhatsApp%20Image%202025-04-13%20at%203.06.29%20PM.jpeg?alt=media&token=93d482a6-854f-4432-9bf8-201570f4f256';

  try {
    console.log(`Updating event ${eventId} with new image URL...`);
    await updateEvent(eventId, { image: imageUrl });
    console.log('Successfully updated event image!');
  } catch (error) {
    console.error('Failed to update event image:', error);
  }
}

updateEventImage();
