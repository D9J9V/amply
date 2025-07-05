import { NextRequest, NextResponse } from 'next/server';
import { searchTracks } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = searchParams.get('limit');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const tracks = await searchTracks(
      query,
      limit ? parseInt(limit, 10) : 10
    );

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Search API error:', error);
    
    // Check if it's a credentials error
    if (error instanceof Error && error.message.includes('Missing Spotify credentials')) {
      return NextResponse.json(
        { 
          error: 'Spotify API not configured',
          message: 'Please add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to your .env.local file',
          tracks: [] // Return empty array so the app doesn't break
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to search tracks' },
      { status: 500 }
    );
  }
}