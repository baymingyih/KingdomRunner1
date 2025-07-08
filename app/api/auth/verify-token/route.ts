import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/auth/firebase';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const decodedToken = await verifyIdToken(token);
    
    return NextResponse.json({
      uid: decodedToken.uid,
      email: decodedToken.email,
      admin: decodedToken.admin || false
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid token' }, 
      { status: 401 }
    );
  }
}
