import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/init';

export class StorageError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export async function uploadActivityImage(file: File, userId: string, activityId: string): Promise<string> {
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
    // Create a reference with a timestamp to avoid name conflicts
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const imageRef = ref(storage, `activities/${userId}/${activityId}/${fileName}`);
    
    // Set proper metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        uploadedBy: userId
      }
    };
    
    // Upload the file with metadata
    const snapshot = await uploadBytes(imageRef, file, metadata);
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    if (error.code === 'storage/unauthorized') {
      throw new StorageError('Unauthorized. Please check if you are logged in.', 'unauthorized');
    }
    
    if (error.code === 'storage/canceled') {
      throw new StorageError('Upload canceled', 'upload-canceled');
    }
    
    if (error.code === 'storage/unknown') {
      throw new StorageError('An unknown error occurred. Please try again.', 'unknown');
    }

    throw new StorageError('Failed to upload image', error.code);
  }
}