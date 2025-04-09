import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase/admin';

const bucket = adminStorage.bucket('kingdomrunnersdv1');

// Handle OPTIONS requests (preflight)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

export async function POST(request: Request) {
  try {
    console.log('Image upload API called');
    
    // Process the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const activityId = formData.get('activityId') as string;

    if (!file || !activityId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    console.log('Using Firebase Admin Storage');
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `activities/${activityId}/${fileName}`;
    
    // Get file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload file to Firebase Storage
    const fileUpload = bucket.file(filePath);
    
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          uploadedAt: new Date().toISOString()
        }
      }
    });
    
    // Make the file publicly accessible
    await fileUpload.makePublic();
    
    // Get the public URL
    const url = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    console.log('File uploaded successfully:', url);
    
    // Return the URL with CORS headers
    const response = NextResponse.json({ url });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
