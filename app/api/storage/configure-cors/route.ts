import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // The configureCorsForStorage function is no longer used.
    // CORS is configured in app/api/configure-cors/route.ts
    return NextResponse.json({ message: 'CORS configuration is now handled in /api/configure-cors' }, { status: 200 });
  } catch (error) {
    console.error('Failed to configure CORS:', error);
    return NextResponse.json(
      { error: 'Failed to configure CORS' },
      { status: 500 }
    );
  }
}
