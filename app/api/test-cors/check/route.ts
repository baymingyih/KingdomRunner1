import { NextResponse } from 'next/server';
import { ref } from 'firebase/storage';
import { storage } from '@/lib/firebase/init';

export async function GET() {
  try {
    const corsConfig = await getCorsConfiguration();
    return NextResponse.json({ 
      configured: !!corsConfig,
      config: corsConfig || null
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to check CORS configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function getCorsConfiguration() {
  const storageRef = ref(storage);
  const bucketName = storageRef.bucket;
  const response = await fetch(
    `https://storage.googleapis.com/storage/v1/b/${bucketName}/o?corsConfiguration`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await getAccessToken()}`
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch CORS config: ${response.statusText}`);
  }
  return await response.json();
}

async function getAccessToken() {
  return '';
}
