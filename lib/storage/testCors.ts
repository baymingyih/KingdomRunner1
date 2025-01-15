import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/init';

export async function testStorageUpload() {
  try {
    // Create a small test file
    const blob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([blob], 'test.txt', { type: 'text/plain' });
    
    // Create a reference
    const testRef = ref(storage, 'test/cors-test.txt');
    
    // Attempt upload
    await uploadBytes(testRef, testFile);
    console.log('CORS test successful - file upload worked');
    return true;
  } catch (error: any) {
    console.error('CORS test failed:', error.message);
    if (error.code === 'storage/unauthorized') {
      console.error('CORS or authentication issue detected');
    }
    return false;
  }
}