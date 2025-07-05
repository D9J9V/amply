# Spotify API Setup Guide

This guide will help you set up the Spotify API integration for Amply's Listening Party Playlists feature.

## Prerequisites

- A Spotify account (free or premium)
- Access to the Spotify Developer Dashboard

## Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create app"
4. Fill in the app details:
   - **App name**: Amply Listening Party
   - **App description**: Collaborative playlist creation for listening parties
   - **Website**: http://localhost:3000 (for development)
   - **Redirect URI**: http://localhost:3000/api/spotify/callback
5. Check "Web API" under "Which API/SDKs are you planning to use?"
6. Agree to the terms and click "Save"

## Step 2: Get Your Credentials

1. After creating the app, you'll see your app dashboard
2. Find your **Client ID** (displayed on the dashboard)
3. Click "Show Client Secret" to reveal your **Client Secret**
4. Copy both values - you'll need them in the next step

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Spotify credentials:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

3. Save the file

## Step 4: Restart the Development Server

After adding the environment variables, restart your development server:

```bash
# Stop the server (Ctrl+C) then:
pnpm dev
```

## How It Works

### Client Credentials Flow

The current implementation uses Spotify's Client Credentials flow, which:
- Allows searching for tracks without user login
- Provides access to public Spotify data
- Perfect for the collaborative playlist search feature

### API Endpoints

- **GET /api/spotify/search?q={query}**: Search for tracks
  - Returns track information including ID, name, artist, album, and duration
  - Limited to 5 results by default

### Current Features

✅ **Implemented:**
- Track search using Spotify Web API
- Real track metadata (name, artist, album, duration)
- Album artwork from Spotify
- Graceful fallback to demo data if API not configured

🚧 **Future Enhancements:**
- User authentication for accessing personal playlists
- Ability to save playlists back to Spotify
- Access to user's listening history for personalized suggestions

## Troubleshooting

### "Spotify API not configured" Error

If you see this error:
1. Make sure you've added the credentials to `.env.local`
2. Restart the development server
3. Check that the credentials are correct

### Rate Limits

Spotify API has rate limits. If you hit them:
- The Client Credentials flow refreshes tokens automatically
- Consider caching search results
- Implement debouncing on the search input

## Security Notes

- **Never commit** your `.env.local` file
- Keep your Client Secret secure
- In production, use environment variables from your hosting provider
- Consider implementing additional rate limiting on your API routes

## Next Steps

With Spotify API configured, you can:
1. Search for real tracks in listening parties
2. Get accurate track metadata and album art
3. Use track IDs for the embedded Spotify player

For production deployment, update your Spotify app settings with your production URLs.