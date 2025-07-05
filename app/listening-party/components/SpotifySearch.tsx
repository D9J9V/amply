"use client";

import { useState } from "react";
import Image from "next/image";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  duration: number;
}

interface SpotifySearchProps {
  onAddTrack: (track: Track) => void;
}

export default function SpotifySearch({ onAddTrack }: SpotifySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search function - in production, this would call your API
  const searchTracks = async () => {
    if (!query.trim()) return;

    setIsSearching(true);

    // Mock results - replace with actual Spotify API call
    setTimeout(() => {
      const mockResults: Track[] = [
        {
          id: "3n3Ppam7vgaVa1iaRUc9Lp",
          name: "Mr. Brightside",
          artist: "The Killers",
          album: "Hot Fuss",
          image: "https://i.scdn.co/image/ab67616d0000b2736c619c39c853f8b1d67b7859",
          duration: 222000
        },
        {
          id: "7qiZfU4dY1lWllzX7mPBI3",
          name: "Shape of You",
          artist: "Ed Sheeran",
          album: "÷ (Deluxe)",
          image: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
          duration: 233000
        },
        {
          id: "4VqPOruhp5EdPBeR92t6lQ",
          name: "Uprising",
          artist: "Muse",
          album: "The Resistance",
          image: "https://i.scdn.co/image/ab67616d0000b2738cb690f962092fd44bbe2bf4",
          duration: 304000
        }
      ];

      setResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchTracks();
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs to add..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
          {results.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Image
                src={track.image}
                alt={track.album}
                width={48}
                height={48}
                className="rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.name}</p>
                <p className="text-sm text-gray-400 truncate">
                  {track.artist} • {track.album}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {formatDuration(track.duration)}
              </span>
              <button
                onClick={() => {
                  onAddTrack(track);
                  setResults([]);
                  setQuery("");
                }}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}