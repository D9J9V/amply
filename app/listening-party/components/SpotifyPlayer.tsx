"use client";

import { useEffect, useRef, useState } from "react";

interface SpotifyPlayerProps {
  trackId: string;
  isHost: boolean;
  onPlaybackChange?: (playing: boolean, position: number) => void;
  syncState?: { playing: boolean; position: number };
}

interface EmbedController {
  play: () => void;
  pause: () => void;
  seek: (position: number) => void;
  addListener: (event: string, callback: (data: PlaybackState) => void) => void;
  removeListener: (event: string, callback: (data: PlaybackState) => void) => void;
}

interface PlaybackState {
  isPaused: boolean;
  position: number;
  duration: number;
}

interface IFrameAPI {
  createController: (element: HTMLElement, options: object, callback: (controller: EmbedController) => void) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: unknown) => void;
  }
}

export default function SpotifyPlayer({ 
  trackId, 
  isHost, 
  onPlaybackChange,
  syncState 
}: SpotifyPlayerProps) {
  const embedController = useRef<EmbedController | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Spotify iFrame API
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const element = playerRef.current;
      if (!element) return;

      const api = IFrameAPI as IFrameAPI;
      const options = {
        uri: `spotify:track:${trackId}`,
        width: '100%',
        height: '152',
      };

      const callback = (controller: EmbedController) => {
        embedController.current = controller;
        setIsReady(true);

        // Set up event listeners
        controller.addListener('ready', () => {
          console.log('Spotify player ready');
        });

        controller.addListener('playback_update', (e: { data: PlaybackState }) => {
          setIsPlaying(!e.data.isPaused);
          setCurrentPosition(e.data.position);
          
          if (isHost && onPlaybackChange) {
            onPlaybackChange(!e.data.isPaused, e.data.position);
          }
        });
      };

      api.createController(element, options, callback);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (embedController.current) {
        embedController.current.destroy();
      }
      document.body.removeChild(script);
    };
  }, [trackId, isHost, onPlaybackChange]);

  // Sync playback for non-hosts
  useEffect(() => {
    if (!isHost && embedController.current && syncState) {
      if (syncState.playing && !isPlaying) {
        embedController.current.play();
      } else if (!syncState.playing && isPlaying) {
        embedController.current.pause();
      }

      // Sync position if difference is significant
      if (Math.abs(syncState.position - currentPosition) > 2000) {
        embedController.current.seek(syncState.position);
      }
    }
  }, [isHost, syncState, isPlaying, currentPosition]);

  const handlePlayPause = () => {
    if (!embedController.current || !isHost) return;

    embedController.current.togglePlay();
  };


  return (
    <div className="space-y-4">
      <div ref={playerRef} className="w-full" />
      
      {isHost && isReady && (
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      )}

      {!isHost && (
        <div className="text-center text-sm text-gray-400">
          Playback controlled by host
        </div>
      )}
    </div>
  );
}