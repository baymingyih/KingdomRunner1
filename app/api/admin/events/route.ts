import { adminFirestore } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth/utils';

export async function POST(req: Request) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { action, eventData } = body;

    switch (action) {
      case 'update':
        await adminFirestore
          .collection('events')
          .doc(eventData.id)
          .update(eventData);
        return NextResponse.json({ success: true });

      case 'delete':
        await adminFirestore
          .collection('events')
          .doc(eventData.id)
          .delete();
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Admin event operation failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
