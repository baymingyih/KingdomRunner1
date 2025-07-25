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

  // Try direct Firebase Storage upload first
  try {
    // Create a reference to the file location in Firebase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `activities/${userId}/${activityId}/${fileName}`;
    const fileRef = ref(storage, filePath);
    
    // Upload the file directly to Firebase Storage
    await uploadBytes(fileRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    console.log('Direct upload successful! URL:', downloadURL);
    return downloadURL;
  } catch (directUploadError: any) {
    console.warn('Direct upload failed, trying API route fallback:', directUploadError);
    
    // Fall back to image-upload API route which provides public URLs
    console.warn('Direct upload failed, falling back to image-upload API route');
    return uploadViaApiRoute(file, userId, activityId);
  }
}

// Fallback function that uses the API route
async function uploadViaApiRoute(file: File, userId: string, activityId: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('activityId', activityId);

    // Use the image-upload endpoint which provides public URLs
    const response = await fetch('/api/storage/image-upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API route error response:', errorText);
      throw new StorageError(errorText || 'Upload failed', response.status.toString());
    }

    const result = await response.json();
    if (!result.url) {
      throw new StorageError('Invalid response from image upload API', 'invalid-response');
    }
    console.log('Image upload API successful! URL:', result.url);
    return result.url;
  } catch (apiError: any) {
    console.error('Error uploading via API route:', apiError);
    
    if (apiError instanceof StorageError) {
      throw apiError;
    }

    throw new StorageError(
      apiError.message || 'Failed to upload image via API route',
      apiError.code || 'api-upload-failed'
    );
  }
}
