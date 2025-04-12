import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase/admin';

const bucket = adminStorage.bucket();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');
    const activityId = formData.get('activityId');

    if (!(file instanceof File) || typeof userId !== 'string' || typeof activityId !== 'string') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a unique filename
    const fileName = `activities/${userId}/${activityId}/${Date.now()}-${file.name}`;
    const fileRef = bucket.file(fileName);

    // Convert file to buffer and upload
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty file buffer');
    }

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
      validation: false // Skip validation to prevent payload errors
    });

    // Make the file publicly accessible and get URL
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2491' // Far future date
    });

    return new NextResponse(JSON.stringify({ url }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    console.error('Stack trace:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details
    });
    return NextResponse.json(
      { 
        error: error.message || 'Upload failed',
        code: error.code,
        details: error.details
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
