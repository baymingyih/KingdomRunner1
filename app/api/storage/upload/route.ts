import { NextResponse } from 'next/server';
import { uploadActivityImage } from '@/lib/storage/uploadImage';
import { getAuthCookie } from '@/lib/auth/utils';
import { getUser } from '@/lib/db/users';

export async function POST(request: Request) {
  try {
    const authToken = await getAuthCookie();
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUser(authToken.value);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const activityId = formData.get('activityId') as string;

    if (!file || !activityId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const url = await uploadActivityImage(file, user.uid, activityId);
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: error.code === 'unauthorized' ? 401 : 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
