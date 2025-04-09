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
    const formData = new FormData();
    formData.append('file', file);
    formData.append('activityId', activityId);

    const response = await fetch('/api/storage/image-upload', {
      method: 'POST',
      body: formData
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new StorageError(responseData.error || 'Upload failed', 'upload-failed');
    }

    const { url } = responseData;
    return url;
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
