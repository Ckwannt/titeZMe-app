import { NextResponse } from 'next/server';
import { getApps } from 'firebase-admin/app';
import { adminDb } from '@/lib/firebase-admin';

const ALLOWED_LABELS = ['back', 'left', 'right', 'front'] as const;
const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET_NAME = 'gen-lang-client-0539007834.firebasestorage.app';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Importing adminDb ensures the admin app is initialized.
    void adminDb;
    const app = getApps()[0];
    if (!app) {
      return NextResponse.json({ error: 'Admin SDK not initialized' }, { status: 500 });
    }

    const { getAuth } = await import('firebase-admin/auth');
    let decoded;
    try {
      decoded = await getAuth(app).verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
    const data = userDoc.data();
    const isAdmin = data?.isAdmin === true || data?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get('file');
    const labelRaw = form.get('label');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }
    const label = typeof labelRaw === 'string' ? labelRaw : '';
    if (!ALLOWED_LABELS.includes(label as typeof ALLOWED_LABELS[number])) {
      return NextResponse.json({ error: 'Invalid label' }, { status: 400 });
    }

    const blob = file as Blob & { name?: string; type?: string; size?: number };
    const contentType = blob.type || 'application/octet-stream';
    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }
    const size = blob.size ?? 0;
    if (size <= 0) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 });
    }
    if (size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds 5MB' }, { status: 400 });
    }

    const arrayBuf = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    const extFromType = contentType.split('/')[1] || 'jpg';
    const safeExt = extFromType.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
    const path = `challenge-reference-photos/${label}-${Date.now()}.${safeExt}`;

    const { getStorage } = await import('firebase-admin/storage');
    let bucket;
    try {
      bucket = getStorage(app).bucket();
      if (!bucket.name) throw new Error('no default bucket');
    } catch {
      bucket = getStorage(app).bucket(BUCKET_NAME);
    }

    const fileRef = bucket.file(path);
    await fileRef.save(buffer, { contentType, public: true });
    await fileRef.makePublic();

    const url = `https://storage.googleapis.com/${bucket.name}/${path}`;
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error('upload-reference-photo error:', err);
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 });
  }
}
