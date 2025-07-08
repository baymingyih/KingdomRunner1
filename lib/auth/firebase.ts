import { getAuth } from 'firebase-admin/auth';
import admin from '../firebase/admin';

export async function verifyIdToken(token: string) {
  try {
    const auth = getAuth(admin);
    const decodedToken = await auth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      admin: decodedToken.admin || false
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

export function verifyCsrfToken(token: string, uid: string): boolean {
  // Implement your CSRF token verification logic here
  // This is a placeholder - you should use a proper CSRF token library
  return !!token && token.length > 10; // Basic example
}
