"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { PartyTrack } from "@/lib/supabase/types";
import SpotifySearch from "./SpotifySearch";

interface PartyPlaylistProps {
  partyId: string;
  isHost: boolean;
  currentUserId: string;
  onTrackSelect?: (track: PartyTrack) => void;
}

export default function PartyPlaylist({ 
  partyId, 
  isHost, 
  currentUserId,
  onTrackSelect 
}: PartyPlaylistProps) {
  const [tracks, setTracks] = useState<PartyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  // Load playlist
  useEffect(() => {
    const loadPlaylist = async () => {
      const { data } = await supabase
        .from('party_playlist')
        .select('*, user:users!added_by(*)')
        .eq('party_id', partyId)
        .order('position', { ascending: true });
      
      if (data) {
        setTracks(data);
      }
      setLoading(false);
    };

    loadPlaylist();

    // Subscribe to changes
    const channel = supabase
      .channel(`playlist:${partyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'party_playlist',
          filter: `party_id=eq.${partyId}`
        },
        () => {
          loadPlaylist();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partyId]);

  // Add track from Spotify search
  const handleAddTrack = async (spotifyTrack: {
    id: string;
    name: string;
    artist: string;
    album: string;
    image: string;
    duration: number;
  }) => {
    const nextPosition = tracks.length;
    
    await supabase.from('party_playlist').insert({
      party_id: partyId,
      spotify_track_id: spotifyTrack.id,
      track_name: spotifyTrack.name,
      track_artist: spotifyTrack.artist,
      track_album: spotifyTrack.album,
      track_image: spotifyTrack.image,
      duration_ms: spotifyTrack.duration,
      added_by: currentUserId,
      position: nextPosition
    });

    setShowSearch(false);
  };

  // Remove track (host only)
  const handleRemoveTrack = async (trackId: string) => {
    if (!isHost) return;
    
    await supabase
      .from('party_playlist')
      .delete()
      .eq('id', trackId);
  };

  // Play track (host only)
  const handlePlayTrack = async (track: PartyTrack) => {
    if (!isHost) return;

    // Update playback state
    await supabase
      .from('party_playback_state')
      .upsert({
        party_id: partyId,
        track_id: track.spotify_track_id,
        track_name: track.track_name,
        track_artist: track.track_artist,
        track_image: track.track_image,
        position_ms: 0,
        is_playing: true,
        updated_at: new Date().toISOString()
      });

    // Mark as played
    await supabase
      .from('party_playlist')
      .update({ played_at: new Date().toISOString() })
      .eq('id', track.id);

    if (onTrackSelect) {
      onTrackSelect(track);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Playlist</h3>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg text-sm transition-colors"
        >
          Add Track
        </button>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="bg-gray-800 rounded-lg p-4">
          <SpotifySearch onAddTrack={handleAddTrack} />
        </div>
      )}

      {/* Track List */}
      <div className="space-y-2">
        {tracks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No tracks added yet. Be the first to add a song!
          </p>
        ) : (
          tracks.map((track, index) => (
            <div
              key={track.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                track.played_at 
                  ? 'bg-gray-800/50 opacity-60' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="text-gray-400 w-6 text-center text-sm">
                {index + 1}
              </div>
              
              {track.track_image && (
                <Image
                  src={track.track_image}
                  alt={track.track_album || track.track_name}
                  width={40}
                  height={40}
                  className="rounded"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.track_name}</p>
                <p className="text-sm text-gray-400 truncate">{track.track_artist}</p>
              </div>

              {track.user && (
                <div className="flex items-center gap-2">
                  <Image
                    src={track.user.avatar_url || ''}
                    alt={track.user.username}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {track.user.username}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                {isHost && !track.played_at && (
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="text-purple-400 hover:text-purple-300 p-1"
                    title="Play this track"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                )}
                
                {(isHost || track.added_by === currentUserId) && !track.played_at && (
                  <button
                    onClick={() => handleRemoveTrack(track.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Remove track"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                )}

                {track.played_at && (
                  <span className="text-xs text-gray-500">Played</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}