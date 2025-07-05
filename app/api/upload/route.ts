import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Types
interface UploadResponse {
  success: boolean;
  blobId?: string;
  error?: string;
  deletable?: boolean;
  size?: number;
}

interface WalrusResponse {
  blobId: string;
  size: number;
  cost: number;
  deletable: boolean;
}

// Constants
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/flac',
  'audio/aac',
  'audio/m4a'
];
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime'
];

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // 1. Verify authentication (World ID)
    const headersList = await headers();
    const worldIdToken = headersList.get('x-world-id-token');
    
    if (!worldIdToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // TODO: Verify World ID token here
    // For now, we'll proceed with the implementation
    
    // 2. Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isDraft = formData.get('draft') === 'true';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // 3. Validate file type
    const contentType = file.type;
    const isAudio = ALLOWED_AUDIO_TYPES.includes(contentType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(contentType);
    
    if (!isAudio && !isVideo) {
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${contentType}` },
        { status: 400 }
      );
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // 5. Get Walrus publisher URL from environment
    const publisherUrl = process.env.WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space';
    
    // 6. Upload to Walrus
    const walrusUrl = `${publisherUrl}/v1/blobs${isDraft ? '?deletable=true' : ''}`;
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const walrusResponse = await fetch(walrusUrl, {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': contentType,
      },
    });

    if (!walrusResponse.ok) {
      const errorText = await walrusResponse.text();
      console.error('Walrus upload failed:', errorText);
      return NextResponse.json(
        { success: false, error: 'Storage upload failed' },
        { status: 500 }
      );
    }

    const walrusData: WalrusResponse = await walrusResponse.json();

    // 7. TODO: Store metadata in database
    // This would include:
    // - User ID (from World ID)
    // - Blob ID
    // - Content type
    // - File name
    // - Upload timestamp
    // - Draft status

    // 8. Return success response
    return NextResponse.json({
      success: true,
      blobId: walrusData.blobId,
      deletable: walrusData.deletable,
      size: walrusData.size,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-world-id-token',
    },
  });
}