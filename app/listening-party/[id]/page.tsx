"use client";

import { useState, useRef } from "react";
// import { useParams } from "next/navigation"; // Will use when connecting to backend
import Link from "next/link";
import Image from "next/image";

interface Track {
  id: string;
  name: string;
  artist: string;
  spotifyId: string;
  addedBy: string;
  addedByAvatar: string;
  votes: number;
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: Date;
}

export default function ListeningPartyRoom() {
  // const params = useParams();
  // const partyId = params.id as string; // Will use when connecting to backend
  
  const [isVerified, setIsVerified] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([
    {
      id: "1",
      name: "So What",
      artist: "Miles Davis",
      spotifyId: "0qF2Og1j8uCbKsYqplryDH",
      addedBy: "Sarah Chen",
      addedByAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      votes: 12
    },
    {
      id: "2",
      name: "Take Five",
      artist: "Dave Brubeck",
      spotifyId: "1YQWosTIljIvxAgHWTp7KP",
      addedBy: "Alex Rivers",
      addedByAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      votes: 8
    }
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      text: "Welcome everyone! Let's discover some amazing jazz together 🎵",
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const spotifyEmbedRef = useRef<HTMLDivElement>(null);

  // Simulate World ID verification
  const handleVerification = () => {
    // In production, this would trigger World ID SDK
    setTimeout(() => {
      setIsVerified(true);
      // Check if user is host (for demo, make first user the host)
      setIsHost(true);
    }, 1000);
  };

  // Handle track control (host only)
  const handlePlayPause = () => {
    if (!isHost) return;
    setIsPlaying(!isPlaying);
    // In production, sync this state with all participants
  };

  const handleNextTrack = () => {
    if (!isHost) return;
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handlePrevTrack = () => {
    if (!isHost) return;
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  // Add track to playlist
  const handleAddTrack = (spotifyId: string) => {
    // In production, this would search Spotify and add track
    const newTrack: Track = {
      id: Date.now().toString(),
      name: "New Track",
      artist: "Artist Name",
      spotifyId,
      addedBy: "You",
      addedByAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      votes: 0
    };
    setPlaylist([...playlist, newTrack]);
  };

  // Vote for track
  const handleVote = (trackId: string) => {
    setPlaylist(playlist.map(track => 
      track.id === trackId 
        ? { ...track, votes: track.votes + 1 }
        : track
    ));
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: "You",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      text: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const currentTrack = playlist[currentTrackIndex];

  // Verification Gate
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Verify Your Humanity</h1>
          <p className="text-gray-400 mb-8">
            This listening party is for verified humans only. Please verify with World ID to join.
          </p>
          <button
            onClick={handleVerification}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Verify with World ID
          </button>
          <Link
            href="/listening-party"
            className="block mt-4 text-purple-400 hover:text-purple-300"
          >
            Back to Parties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="h-screen flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-800 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Late Night Jazz Vibes</h1>
                <p className="text-gray-400">Hosted by Sarah Chen • 87/100 participants</p>
              </div>
              <Link
                href="/listening-party"
                className="text-purple-400 hover:text-purple-300"
              >
                Leave Party
              </Link>
            </div>
          </div>

          {/* Player */}
          <div className="bg-gradient-to-b from-purple-900/20 to-transparent p-6">
            {currentTrack && (
              <>
                {/* Spotify Embed */}
                <div ref={spotifyEmbedRef} className="mb-6">
                  <iframe
                    src={`https://open.spotify.com/embed/track/${currentTrack.spotifyId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>

                {/* Host Controls */}
                {isHost && (
                  <div className="flex justify-center gap-4 mb-6">
                    <button
                      onClick={handlePrevTrack}
                      className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                      disabled={currentTrackIndex === 0}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                      </svg>
                    </button>
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
                    <button
                      onClick={handleNextTrack}
                      className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                      disabled={currentTrackIndex === playlist.length - 1}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                      </svg>
                    </button>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-sm text-gray-400">Added by {currentTrack.addedBy}</p>
                </div>
              </>
            )}
          </div>

          {/* Playlist */}
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Collaborative Playlist</h2>
            
            {/* Add Track */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search for a song to add..."
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => handleAddTrack("demo")}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Song
                </button>
              </div>
            </div>

            {/* Track List */}
            <div className="space-y-2">
              {playlist.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    index === currentTrackIndex
                      ? "bg-purple-900/30 border border-purple-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  <div className="text-gray-400 w-8 text-center">
                    {index + 1}
                  </div>
                  <Image
                    src={track.addedByAvatar}
                    alt={track.addedBy}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    by {track.addedBy}
                  </div>
                  <button
                    onClick={() => handleVote(track.id)}
                    className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>{track.votes}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-sm text-gray-400">87 verified humans</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="flex gap-3">
                <Image
                  src={msg.avatar}
                  alt={msg.user}
                  width={32}
                  height={32}
                  className="rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-sm">{msg.user}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}