"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface ListeningParty {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  genre: string;
  participantCount: number;
  maxParticipants: number;
  startTime: Date;
  status: "upcoming" | "live" | "ended";
  currentTrack?: {
    name: string;
    artist: string;
    spotifyId: string;
  };
}

// Mock data for demonstration
const mockParties: ListeningParty[] = [
  {
    id: "1",
    title: "Late Night Jazz Vibes",
    hostName: "Sarah Chen",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    genre: "Jazz",
    participantCount: 87,
    maxParticipants: 100,
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    status: "live",
    currentTrack: {
      name: "So What",
      artist: "Miles Davis",
      spotifyId: "0qF2Og1j8uCbKsYqplryDH"
    }
  },
  {
    id: "2",
    title: "Indie Discovery Session",
    hostName: "Alex Rivers",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    genre: "Indie",
    participantCount: 234,
    maxParticipants: 300,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    status: "upcoming"
  },
  {
    id: "3",
    title: "Electronic Sunrise",
    hostName: "DJ Quantum",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quantum",
    genre: "Electronic",
    participantCount: 156,
    maxParticipants: 200,
    startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    status: "live",
    currentTrack: {
      name: "Strobe",
      artist: "deadmau5",
      spotifyId: "1EaKOBaHQ5dk2MsaHEJaur"
    }
  }
];

export default function ListeningPartyPage() {
  const [parties] = useState<ListeningParty[]>(mockParties);
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  const genres = ["all", "Jazz", "Indie", "Electronic", "Hip-Hop", "Rock", "Pop"];

  const filteredParties = parties.filter(party => {
    if (filter !== "all" && party.status !== filter) return false;
    if (selectedGenre !== "all" && party.genre !== selectedGenre) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Listening Party Playlists</h1>
          <p className="text-gray-400 text-lg">
            Join verified humans creating authentic playlists in real-time
          </p>
        </div>

        {/* Create Party CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Host Your Own Party</h2>
              <p className="text-white/80">
                Create an exclusive listening experience for your fans
              </p>
            </div>
            <Link
              href="/listening-party/create"
              className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Party
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                filter === "all"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Parties
            </button>
            <button
              onClick={() => setFilter("live")}
              className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                filter === "live"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live Now
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                filter === "upcoming"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Upcoming
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Party Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParties.map(party => (
            <Link
              key={party.id}
              href={`/listening-party/${party.id}`}
              className="group"
            >
              <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-purple-600">
                {/* Host Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={party.hostAvatar}
                    alt={party.hostName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{party.hostName}</p>
                    <p className="text-sm text-gray-400">{party.genre}</p>
                  </div>
                </div>

                {/* Party Title */}
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  {party.title}
                </h3>

                {/* Status */}
                {party.status === "live" && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                      LIVE NOW
                    </div>
                    {party.currentTrack && (
                      <div className="bg-black/50 rounded p-2 text-sm">
                        <p className="text-gray-300">Now playing:</p>
                        <p className="font-medium truncate">
                          {party.currentTrack.name} - {party.currentTrack.artist}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {party.status === "upcoming" && (
                  <div className="mb-4 text-sm text-gray-400">
                    Starts {formatDistanceToNow(party.startTime, { addSuffix: true })}
                  </div>
                )}

                {/* Participants */}
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    {party.participantCount}/{party.maxParticipants} verified humans
                  </div>
                  {party.status === "live" && (
                    <span className="text-sm bg-purple-600 px-3 py-1 rounded-full">
                      Join
                    </span>
                  )}
                  {party.status === "upcoming" && (
                    <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
                      RSVP
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4 bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-300"
                    style={{
                      width: `${(party.participantCount / party.maxParticipants) * 100}%`
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredParties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No parties found</p>
            <Link
              href="/listening-party/create"
              className="text-purple-400 hover:text-purple-300"
            >
              Be the first to create one!
            </Link>
          </div>
        )}

        {/* History Link */}
        <div className="mt-12 text-center">
          <Link
            href="/listening-party/history"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Browse Past Parties & Playlists →
          </Link>
        </div>
      </div>
    </div>
  );
}