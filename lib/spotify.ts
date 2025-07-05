import { SpotifyApi } from '@spotify/web-api-ts-sdk';

// For server-side API calls using Client Credentials flow
// This allows searching without user authentication
let spotifyClient: SpotifyApi | null = null;

export async function getSpotifyClient() {
  // Check if we have credentials
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Spotify credentials. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env.local file'
    );
  }

  // Create or return existing client
  if (!spotifyClient) {
    spotifyClient = SpotifyApi.withClientCredentials(
      clientId,
      clientSecret
    );
  }

  return spotifyClient;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  duration: number;
  uri: string;
  preview_url: string | null;
}

export async function searchTracks(query: string, limit: number = 10): Promise<SpotifyTrack[]> {
  try {
    const client = await getSpotifyClient();
    // Search without limit parameter (will use default)
    const results = await client.search(query, ['track'], 'US');

    if (!results.tracks.items.length) {
      return [];
    }

    // Apply limit manually since SDK doesn't accept it
    const tracks = results.tracks.items.slice(0, limit);

    return tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      image: track.album.images[0]?.url || '',
      duration: track.duration_ms,
      uri: track.uri,
      preview_url: track.preview_url
    }));
  } catch (error) {
    console.error('Spotify search error:', error);
    throw error;
  }
}