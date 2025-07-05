"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface HistoricalParty {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  genre: string;
  date: Date;
  participantCount: number;
  trackCount: number;
  nftMinted: boolean;
  coverImage: string;
  topContributors: {
    name: string;
    avatar: string;
    tracksAdded: number;
  }[];
}

const mockHistory: HistoricalParty[] = [
  {
    id: "1",
    title: "Summer Indie Vibes 2024",
    hostName: "Maya Patel",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    genre: "Indie",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    participantCount: 234,
    trackCount: 47,
    nftMinted: true,
    coverImage: "https://picsum.photos/seed/party1/400/400",
    topContributors: [
      { name: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", tracksAdded: 8 },
      { name: "Jordan Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan", tracksAdded: 6 },
      { name: "Sam Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam", tracksAdded: 5 }
    ]
  },
  {
    id: "2",
    title: "Electronic Underground",
    hostName: "DJ Nexus",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nexus",
    genre: "Electronic",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    participantCount: 456,
    trackCount: 72,
    nftMinted: true,
    coverImage: "https://picsum.photos/seed/party2/400/400",
    topContributors: [
      { name: "Riley Tech", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riley", tracksAdded: 12 },
      { name: "Casey Beats", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey", tracksAdded: 9 }
    ]
  },
  {
    id: "3",
    title: "Jazz After Dark",
    hostName: "Miles Thompson",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miles",
    genre: "Jazz",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    participantCount: 89,
    trackCount: 23,
    nftMinted: false,
    coverImage: "https://picsum.photos/seed/party3/400/400",
    topContributors: [
      { name: "Charlie Blues", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie", tracksAdded: 4 }
    ]
  }
];

export default function ListeningPartyHistory() {
  const [filter, setFilter] = useState<"all" | "attended" | "hosted">("all");
  const [selectedGenre, setSelectedGenre] = useState("all");

  const genres = ["all", "Jazz", "Indie", "Electronic", "Hip-Hop", "Rock", "Pop"];

  const filteredParties = mockHistory.filter(party => {
    if (selectedGenre !== "all" && party.genre !== selectedGenre) return false;
    // In production, would filter by actual attendance/hosting records
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/listening-party"
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Live Parties
          </Link>
          <h1 className="text-4xl font-bold mb-4">Party History</h1>
          <p className="text-gray-400 text-lg">
            Explore playlists created by verified humans in past listening parties
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-3xl font-bold text-purple-400">127</p>
            <p className="text-gray-400">Total Parties</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-3xl font-bold text-purple-400">3,421</p>
            <p className="text-gray-400">Unique Tracks</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-3xl font-bold text-purple-400">8,934</p>
            <p className="text-gray-400">Verified Humans</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-3xl font-bold text-purple-400">89</p>
            <p className="text-gray-400">NFTs Minted</p>
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
              onClick={() => setFilter("attended")}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                filter === "attended"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Attended
            </button>
            <button
              onClick={() => setFilter("hosted")}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                filter === "hosted"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Hosted
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
            <div key={party.id} className="group cursor-pointer">
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 border border-gray-800 hover:border-purple-600">
                {/* Cover Image */}
                <div className="relative aspect-square">
                  <Image
                    src={party.coverImage}
                    alt={party.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold mb-1">{party.title}</h3>
                    <p className="text-sm text-gray-300">{party.trackCount} tracks</p>
                  </div>
                  {party.nftMinted && (
                    <div className="absolute top-4 right-4 bg-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                      NFT
                    </div>
                  )}
                </div>

                {/* Party Info */}
                <div className="p-4">
                  {/* Host */}
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={party.hostAvatar}
                      alt={party.hostName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Hosted by {party.hostName}</p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(party.date, { addSuffix: true })}
                      </p>
                    </div>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                      {party.genre}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-400 mb-3">
                    <span>{party.participantCount} participants</span>
                    <span>{party.trackCount} tracks</span>
                  </div>

                  {/* Top Contributors */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Top Contributors</p>
                    <div className="flex -space-x-2">
                      {party.topContributors.slice(0, 5).map((contributor, i) => (
                        <Image
                          key={i}
                          src={contributor.avatar}
                          alt={contributor.name}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-gray-900"
                          title={`${contributor.name} - ${contributor.tracksAdded} tracks`}
                        />
                      ))}
                      {party.topContributors.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs">
                          +{party.topContributors.length - 5}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Playlist
                    </button>
                    {party.nftMinted && (
                      <button className="px-4 py-2 rounded-lg text-sm font-medium border border-purple-600 hover:bg-purple-600/20 transition-colors">
                        Own
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
            Load More Parties
          </button>
        </div>
      </div>
    </div>
  );
}