import { adminFirestore } from '../firebase/admin';

export interface StravaTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  athleteId?: number;
  athleteName?: string;
  athleteProfile?: string;
  athleteCity?: string;
  athleteCountry?: string;
}

export async function getStravaTokens(userId: string): Promise<StravaTokens | null> {
  const docRef = adminFirestore.doc(`stravaTokens/${userId}`);
  const docSnap = await docRef.get();
  
  if (docSnap.exists) {
    return docSnap.data() as StravaTokens;
  }
  return null;
}

export async function saveStravaTokens(userId: string, tokens: StravaTokens): Promise<void> {
  const docRef = adminFirestore.doc(`stravaTokens/${userId}`);
  await docRef.set(tokens);
}

// Alias for backward compatibility
export const storeStravaTokens = saveStravaTokens;
