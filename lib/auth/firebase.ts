import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type AuthError as FirebaseAuthError
} from 'firebase/auth';
import { auth } from '../firebase/init';

export class AuthError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function createAuthUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error creating auth user:', error);
    const firebaseError = error as { code?: string };
    if (firebaseError.code) {
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          throw new AuthError('Email already in use', firebaseError.code, firebaseError);
        case 'auth/invalid-email':
          throw new AuthError('Invalid email address', firebaseError.code, firebaseError);
        case 'auth/operation-not-allowed':
          throw new AuthError('Email/password accounts are not enabled', firebaseError.code, firebaseError);
        case 'auth/weak-password':
          throw new AuthError('Password is too weak', firebaseError.code, firebaseError);
        default:
          throw new AuthError('Failed to create account', firebaseError.code, firebaseError);
      }
    }
    throw new AuthError('An unexpected error occurred', 'unknown', error);
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    const firebaseError = error as { code?: string };
    if (firebaseError.code) {
      switch (firebaseError.code) {
        case 'auth/invalid-credential':
          throw new AuthError('Invalid email or password', firebaseError.code, firebaseError);
        case 'auth/user-disabled':
          throw new AuthError('This account has been disabled', firebaseError.code, firebaseError);
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          throw new AuthError('Invalid email or password', firebaseError.code, firebaseError);
        case 'auth/too-many-requests':
          throw new AuthError('Too many failed attempts. Please try again later', firebaseError.code, firebaseError);
        default:
          throw new AuthError('Login failed', firebaseError.code, firebaseError);
      }
    }
    throw new AuthError('An unexpected error occurred', 'unknown', error);
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new AuthError(
      'Failed to sign out. Please try again.',
      (error as { code?: string }).code || 'unknown',
      error
    );
  }
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}
