import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: file.name,
      Body: fileBuffer,
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    return NextResponse.json({ message: '✅ File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: '❌ Upload failed' }, { status: 500 });
  }
}
