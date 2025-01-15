import { NextResponse } from 'next/server';
import { testStorageUpload } from '@/lib/storage/testCors';

export async function GET() {
  try {
    const result = await testStorageUpload();
    return NextResponse.json({ success: result });
  } catch (error) {
    return NextResponse.json({ error: 'CORS test failed' }, { status: 500 });
  }
}