import { NextResponse } from 'next/server';
import { testStorageUpload, StorageError } from '@/lib/storage/testUpload';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const success = await testStorageUpload(file);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Test upload failed:', error);
    
    if (error instanceof StorageError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Test upload failed' },
      { status: 500 }
    );
  }
}