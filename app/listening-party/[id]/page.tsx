"use client";

import { useState } from "react";
// import { useParams } from "next/navigation"; // Will use when connecting to backend
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import SpotifyPlayer from "../components/SpotifyPlayer";
import SpotifySearch from "../components/SpotifySearch";

interface Track {
  id: string;
  name: string;
  artist: string;
  album?: string;
  image?: string;
  spotifyId: string;
  addedBy: string;
  addedByAvatar: string;
  votes: number;
  duration?: number;
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: Date;
}

interface PlaybackState {
  playing: boolean;
  position: number;
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
      album: "Kind of Blue",
      image: "https://i.scdn.co/image/ab67616d0000b27343e0e2db5cd1a0e268e00420",
      spotifyId: "0qF2Og1j8uCbKsYqplryDH",
      addedBy: "Sarah Chen",
      addedByAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      votes: 12,
      duration: 545000
    },
    {
      id: "2",
      name: "Take Five",
      artist: "Dave Brubeck",
      album: "Time Out",
      image: "https://i.scdn.co/image/ab67616d0000b273a48964b5d4394bfc2c5b4450",
      spotifyId: "1YQWosTIljIvxAgHWTp7KP",
      addedBy: "Alex Rivers",
      addedByAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      votes: 8,
      duration: 324000
    }
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    playing: false,
    position: 0
  });
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

  const currentTrack = playlist[currentTrackIndex];

  // Simulate World ID verification for MVP
  const handleVerification = async () => {
    // For MVP demo, create or retrieve a user from localStorage/database
    let userId = localStorage.getItem('amply_demo_user_id');
    
    if (!userId) {
      // Create a new user in the database
      const newUser = {
        id: crypto.randomUUID(),
        username: `User_${Math.floor(Math.random() * 1000)}`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
      };
      
      const { data } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();
      
      if (data) {
        localStorage.setItem('amply_demo_user_id', data.id);
      }
    }
    
    // Skip actual World ID verification for MVP
    setTimeout(() => {
      setIsVerified(true);
      // For demo purposes, make first user the host
      setIsHost(true);
    }, 1000);
  };

  // Handle playback state changes from host
  const handlePlaybackChange = (playing: boolean, position: number) => {
    setPlaybackState({ playing, position });
    // In production, broadcast this state to all participants
  };

  const handleNextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setPlaybackState({ playing: true, position: 0 });
    }
  };

  const handlePrevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setPlaybackState({ playing: true, position: 0 });
    }
  };

  // Auto-advance feature can be added here in production
  // with proper WebSocket/real-time sync

  // Add track from Spotify search
  const handleAddTrack = (spotifyTrack: {
    id: string;
    name: string;
    artist: string;
    album: string;
    image: string;
    duration: number;
  }) => {
    const newTrack: Track = {
      id: Date.now().toString(),
      name: spotifyTrack.name,
      artist: spotifyTrack.artist,
      album: spotifyTrack.album,
      image: spotifyTrack.image,
      spotifyId: spotifyTrack.id,
      addedBy: "You",
      addedByAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      votes: 0,
      duration: spotifyTrack.duration
    };
    
    setPlaylist([...playlist, newTrack]);
    
    // Add system message
    const systemMessage: Message = {
      id: Date.now().toString(),
      user: "System",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=System",
      text: `You added "${newTrack.name}" by ${newTrack.artist} to the playlist`,
      timestamp: new Date()
    };
    setMessages([...messages, systemMessage]);
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
                    <h2 className="text-2xl font-bold">{currentTrack.name}</h2>
                    <p className="text-gray-400">{currentTrack.artist}</p>
                    {currentTrack.album && (
                      <p className="text-sm text-gray-500">{currentTrack.album}</p>
                    )}
                  </div>
                </div>

                {/* Spotify Player with iFrame API */}
                <SpotifyPlayer
                  trackId={currentTrack.spotifyId}
                  isHost={isHost}
                  onPlaybackChange={handlePlaybackChange}
                  syncState={!isHost ? playbackState : undefined}
                />

                {/* Navigation Controls for Host */}
                {isHost && (
                  <div className="flex justify-center gap-4 mt-4">
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

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-400">Added by {currentTrack.addedBy}</p>
                </div>
              </>
            )}
          </div>

          {/* Playlist */}
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Collaborative Playlist</h2>
            
            {/* Add Track with Spotify Search */}
            <div className="mb-6">
              <SpotifySearch onAddTrack={handleAddTrack} />
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
                  {track.image && (
                    <Image
                      src={track.image}
                      alt={track.album || track.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  )}
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