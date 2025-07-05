import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isDraft = searchParams.get('deletable') === 'true';
    
    // Get the publisher URL
    const publisherUrl = process.env.WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space';
    const url = `${publisherUrl}/v1/blobs${isDraft ? '?deletable=true' : ''}`;
    
    // Get the body as raw data
    const body = await request.arrayBuffer();
    
    // Forward the request to Walrus
    const response = await fetch(url, {
      method: 'PUT',
      body: body,
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/octet-stream',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Walrus upload failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}