'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Lock, Unlock, Music, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { walrusStorage, type ArtistContent } from '@/lib/services/walrus-storage';

interface WalrusContentPlayerProps {
  content: ArtistContent;
  artistName: string;
  coverImage?: string;
  userId?: string;
  onSupportArtist?: () => void;
}

export default function WalrusContentPlayer({
  content,
  artistName,
  coverImage,
  userId,
  onSupportArtist,
}: WalrusContentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(!content.isPrivate);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Reset state when content changes
    setIsPlaying(false);
    setStreamUrl(null);
    setError(null);
    setHasAccess(!content.isPrivate);
  }, [content.id, content.isPrivate]);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    // If no stream URL yet, load it
    if (!streamUrl) {
      setIsLoading(true);
      setError(null);

      try {
        const result = await walrusStorage.getContentStreamUrl(
          content.id,
          userId || 'demo-user-id' // In production, get from auth
        );

        if (result && result.hasAccess) {
          setStreamUrl(result.url);
          setHasAccess(true);
          
          // Wait for URL to be set, then play
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.src = result.url;
              audioRef.current.play();
              setIsPlaying(true);
            }
          }, 100);
        } else {
          setHasAccess(false);
          setError('You need to support this artist to access this content');
        }
      } catch (err) {
        console.error('Error loading stream:', err);
        setError('Failed to load content');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Toggle play/pause
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Cover Image */}
          <div className="w-20 h-20 bg-gradient-to-br from-amply-orange to-amply-pink rounded-2xl flex items-center justify-center flex-shrink-0">
            {coverImage ? (
              <img
                src={coverImage}
                alt={content.title}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <Music className="w-10 h-10 text-white" />
            )}
          </div>

          {/* Content Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-amply-black truncate">
              {content.title}
            </h3>
            <p className="text-gray-600 text-sm">{artistName}</p>
            {content.metadata?.duration && (
              <p className="text-gray-500 text-xs mt-1">
                {formatDuration(content.metadata.duration)}
              </p>
            )}
            
            {/* Private Content Badge */}
            {content.isPrivate && (
              <div className="flex items-center mt-2">
                <Lock className="w-3 h-3 text-amply-orange mr-1" />
                <span className="text-xs text-amply-orange font-medium">
                  Supporter Exclusive
                </span>
              </div>
            )}
          </div>

          {/* Play Button */}
          <Button
            onClick={handlePlayPause}
            disabled={isLoading || (!hasAccess && content.isPrivate)}
            className="w-12 h-12 rounded-full bg-amply-gradient text-white hover:opacity-90 transition-opacity flex items-center justify-center p-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
        </div>

        {/* Error or Access Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-sm text-red-700">{error}</p>
            {!hasAccess && onSupportArtist && (
              <Button
                onClick={onSupportArtist}
                className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-1.5"
              >
                Support Artist to Unlock
              </Button>
            )}
          </div>
        )}

        {/* Play Count */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{content.playCount} plays</span>
          <span className="flex items-center">
            {content.isPrivate ? (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Private
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 mr-1" />
                Public
              </>
            )}
          </span>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio error:', e);
          setError('Failed to play audio');
          setIsPlaying(false);
        }}
      />
    </div>
  );
}