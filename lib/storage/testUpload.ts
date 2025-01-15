import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/init';

export class StorageError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export async function testStorageUpload(file: File): Promise<boolean> {
  try {
    // Create a reference with a timestamp to avoid conflicts
    const timestamp = Date.now();
    const testRef = ref(storage, `test/cors-test-${timestamp}.txt`);
    
    // Upload the file
    await uploadBytes(testRef, file);
    return true;
  } catch (error: any) {
    console.error('Storage upload test failed:', error);
    
    if (error.code === 'storage/unauthorized') {
      throw new StorageError('Unauthorized. Please check Firebase configuration.', 'unauthorized');
    }
    
    if (error.code === 'storage/unknown') {
      throw new StorageError('Unknown error occurred. Please try again.', 'unknown');
    }
    
    throw new StorageError(error.message || 'Failed to upload test file', error.code);
  }
}