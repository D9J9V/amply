"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { PlaybackState } from "@/lib/supabase/types";

interface SyncedSpotifyPlayerProps {
  partyId: string;
  isHost: boolean;
  currentTrack?: {
    id: string;
    name: string;
    artist: string;
    album?: string;
    image?: string;
    duration?: number;
  };
}

export default function SyncedSpotifyPlayer({ 
  partyId, 
  isHost, 
  currentTrack 
}: SyncedSpotifyPlayerProps) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    party_id: partyId,
    track_id: currentTrack?.id,
    track_name: currentTrack?.name,
    track_artist: currentTrack?.artist,
    track_image: currentTrack?.image,
    position_ms: 0,
    is_playing: false,
    updated_at: new Date().toISOString()
  });
  
  const [localPosition, setLocalPosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Subscribe to playback state changes
  useEffect(() => {
    // Initial load
    const loadPlaybackState = async () => {
      const { data } = await supabase
        .from('party_playback_state')
        .select('*')
        .eq('party_id', partyId)
        .single();
      
      if (data) {
        setPlaybackState(data);
        setLocalPosition(data.position_ms);
      }
    };

    loadPlaybackState();

    // Subscribe to changes
    channelRef.current = supabase
      .channel(`playback:${partyId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'party_playback_state',
          filter: `party_id=eq.${partyId}`
        },
        (payload) => {
          const newState = payload.new as PlaybackState;
          setPlaybackState(newState);
          
          // Calculate adjusted position based on time elapsed
          const timeSinceUpdate = Date.now() - new Date(newState.updated_at).getTime();
          const adjustedPosition = newState.is_playing 
            ? newState.position_ms + timeSinceUpdate
            : newState.position_ms;
          
          setLocalPosition(adjustedPosition);
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [partyId]);

  // Update local position when playing
  useEffect(() => {
    if (playbackState.is_playing) {
      intervalRef.current = setInterval(() => {
        setLocalPosition(prev => prev + 1000);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playbackState.is_playing]);

  // Host controls
  const updatePlaybackState = async (updates: Partial<PlaybackState>) => {
    if (!isHost) return;

    const newState = {
      ...playbackState,
      ...updates,
      party_id: partyId,
      updated_at: new Date().toISOString()
    };

    await supabase
      .from('party_playback_state')
      .upsert(newState);
  };

  const handlePlayPause = () => {
    updatePlaybackState({
      is_playing: !playbackState.is_playing,
      position_ms: localPosition
    });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseInt(e.target.value);
    setLocalPosition(newPosition);
    updatePlaybackState({
      position_ms: newPosition
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 text-center">
        <p className="text-gray-400">No track selected</p>
        {isHost && (
          <p className="text-sm text-gray-500 mt-2">
            Add tracks to the playlist to start playing
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-6">
      {/* Track Info */}
      <div className="flex items-center gap-4 mb-6">
        {currentTrack.image && (
          <Image
            src={currentTrack.image}
            alt={currentTrack.album || currentTrack.name}
            width={80}
            height={80}
            className="rounded-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold">{currentTrack.name}</h3>
          <p className="text-gray-400">{currentTrack.artist}</p>
          {currentTrack.album && (
            <p className="text-sm text-gray-500">{currentTrack.album}</p>
          )}
        </div>
      </div>

      {/* Spotify Embed */}
      <div className="mb-4">
        <iframe
          src={`https://open.spotify.com/embed/track/${currentTrack.id}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-lg"
        />
      </div>

      {/* Sync Controls */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{formatTime(localPosition)}</span>
            <span>{formatTime(currentTrack.duration || 0)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={currentTrack.duration || 0}
            value={localPosition}
            onChange={handleSeek}
            disabled={!isHost}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
          />
        </div>

        {/* Controls */}
        {isHost ? (
          <div className="flex justify-center gap-4">
            <button
              onClick={handlePlayPause}
              className="bg-purple-600 hover:bg-purple-700 p-4 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                {playbackState.is_playing ? (
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                ) : (
                  <path d="M8 5v14l11-7z"/>
                )}
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {playbackState.is_playing ? '🎵 Playing' : '⏸ Paused'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              The host controls playback for everyone
            </p>
          </div>
        )}
      </div>

      {/* Sync Status */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-gray-400">
          <div className={`w-2 h-2 rounded-full ${
            playbackState.is_playing ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
          }`}></div>
          Synced playback
        </div>
      </div>
    </div>
  );
}