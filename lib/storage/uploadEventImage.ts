import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/init';

export class StorageError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export async function uploadEventImage(file: File, eventId: string): Promise<string> {
  if (!file) {
    throw new StorageError('No file provided', 'missing-file');
  }

  // Validate file type
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new StorageError('Invalid file type. Only JPEG, PNG and WebP are allowed', 'invalid-type');
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    throw new StorageError('File too large. Maximum size is 5MB', 'file-too-large');
  }

  try {
    // Create a reference to the file location in Firebase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `events/${eventId}/cover/${fileName}`;
    const fileRef = ref(storage, filePath);
    
    // Upload the file to Firebase Storage
    await uploadBytes(fileRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading event image:', error);
    throw new StorageError(
      error.message || 'Failed to upload event image',
      error.code || 'upload-failed'
    );
  }
}
