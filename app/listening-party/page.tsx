"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Users, Clock, Music, TrendingUp, Plus } from "lucide-react";
import WorldIdBadge from "@/components/world-id-badge";

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

  const genres = [
    { id: "all", label: "All", count: 3 },
    { id: "Jazz", label: "Jazz", count: 1 },
    { id: "Indie", label: "Indie", count: 1 },
    { id: "Electronic", label: "Electronic", count: 1 },
    { id: "Hip-Hop", label: "Hip-Hop", count: 0 },
    { id: "Rock", label: "Rock", count: 0 },
    { id: "Pop", label: "Pop", count: 0 },
  ];

  const filteredParties = parties.filter(party => {
    if (filter !== "all" && party.status !== filter) return false;
    if (selectedGenre !== "all" && party.genre !== selectedGenre) return false;
    return true;
  });

  const liveCount = parties.filter(p => p.status === "live").length;

  return (
    <div className="min-h-screen bg-amply-cream pb-24 md:pb-0">
      <div className="mobile-padding py-8">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-amply-white/95 backdrop-blur-md border-b border-gray-100 shadow-soft -mx-4 sm:-mx-6 px-4 sm:px-6 mb-8">
          <div className="mobile-padding-y">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D098F147-8781-4E47-9FB3-871FA7FD1553.PNG-qO8xf6BHvA7ldsKb1h9esV5l748Xuc.png"
                  alt="Amply Logo"
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shadow-card flex-shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-lg sm:text-2xl font-bold text-amply-black tracking-tight block truncate">
                    AMPLY
                  </span>
                  <div className="text-xs gradient-text font-semibold hidden sm:block">THE FUTURE OF MUSIC IS HUMAN</div>
                </div>
              </Link>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Badge className="animate-soft-pulse flex items-center space-x-1 sm:space-x-2 bg-red-500/20 text-red-600 border-0 px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm">
                  <Radio className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{liveCount} LIVE</span>
                </Badge>
                <WorldIdBadge size="sm" className="hidden sm:flex" />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-amply-black mb-2">Listening Party Playlists</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Join verified humans creating authentic playlists in real-time
              </p>
            </div>
          </div>
        </header>

        {/* Create Party CTA */}
        <div className="bg-gradient-to-r from-amply-orange to-amply-pink rounded-3xl p-6 mb-8 shadow-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Host Your Own Party</h2>
              <p className="text-white/80 text-sm sm:text-base">
                Create an exclusive listening experience for your fans
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href="/listening-party/create" className="flex-1 sm:flex-initial">
                <Button className="bg-white hover:bg-gray-50 text-amply-black px-4 sm:px-6 py-3 rounded-2xl font-semibold w-full shadow-soft">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Party
                </Button>
              </Link>
              <Link href="/listening-party/create-live" className="flex-1 sm:flex-initial">
                <Button className="bg-amply-pink hover:bg-amply-pink/90 text-white px-4 sm:px-6 py-3 rounded-2xl font-semibold border border-white/20 w-full shadow-soft">
                  <Radio className="w-4 h-4 mr-2" />
                  Go Live Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <Button
              onClick={() => setFilter("all")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all whitespace-nowrap flex-shrink-0 touch-target text-sm sm:text-base ${
                filter === "all" ? "amply-button-primary" : "amply-button-outline"
              }`}
            >
              All Parties
            </Button>
            <Button
              onClick={() => setFilter("live")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 touch-target text-sm sm:text-base ${
                filter === "live" ? "bg-red-500 hover:bg-red-600 text-white" : "amply-button-outline"
              }`}
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Live Now
            </Button>
            <Button
              onClick={() => setFilter("upcoming")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all whitespace-nowrap flex-shrink-0 touch-target text-sm sm:text-base ${
                filter === "upcoming" ? "amply-button-primary" : "amply-button-outline"
              }`}
            >
              Upcoming
            </Button>
          </div>

          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {genres.map(genre => (
              <Button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                  selectedGenre === genre.id
                    ? "bg-amply-gradient-soft text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {genre.label}
                {genre.count > 0 && (
                  <Badge className="ml-2 bg-white/20 text-white border-0 text-xs px-2 py-0.5 rounded-full">
                    {genre.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Party Grid */}
        <div className="grid-mobile-responsive gap-4 sm:gap-6">
          {filteredParties.map(party => (
            <Link
              key={party.id}
              href={`/listening-party/${party.id}`}
              className="group"
            >
              <div className="bg-amply-white rounded-3xl p-4 sm:p-6 hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:border-amply-orange/30 shadow-card">
                {/* Host Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amply-orange to-amply-pink rounded-full flex items-center justify-center shadow-soft flex-shrink-0">
                    <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-amply-black truncate">{party.hostName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{party.genre}</p>
                  </div>
                </div>

                {/* Party Title */}
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-amply-black group-hover:text-amply-orange transition-colors line-clamp-2">
                  {party.title}
                </h3>

                {/* Status */}
                {party.status === "live" && (
                  <div className="mb-4">
                    <Badge className="bg-red-500 text-white flex items-center gap-2 px-3 py-1 rounded-xl w-fit mb-3">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      <span className="text-xs font-semibold">LIVE NOW</span>
                    </Badge>
                    {party.currentTrack && (
                      <div className="bg-gray-50 rounded-2xl p-3 text-sm">
                        <p className="text-gray-600 text-xs mb-1">Now playing:</p>
                        <p className="font-medium text-amply-black truncate">
                          {party.currentTrack.name} - {party.currentTrack.artist}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {party.status === "upcoming" && (
                  <div className="mb-4">
                    <Badge className="bg-amply-orange/20 text-amply-orange flex items-center gap-2 px-3 py-1 rounded-xl w-fit">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        Starts {formatDistanceToNow(party.startTime, { addSuffix: true })}
                      </span>
                    </Badge>
                  </div>
                )}

                {/* Participants */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{party.participantCount}/{party.maxParticipants} verified humans</span>
                    </div>
                    <WorldIdBadge size="sm" />
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amply-orange to-amply-pink h-full transition-all duration-300"
                      style={{
                        width: `${(party.participantCount / party.maxParticipants) * 100}%`
                      }}
                    />
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`w-full py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                      party.status === "live"
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-soft"
                        : "amply-button-secondary"
                    }`}
                  >
                    {party.status === "live" ? "Join Party" : "RSVP"}
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredParties.length === 0 && (
          <div className="col-span-full text-center py-12 sm:py-20">
            <Radio className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-2xl sm:text-3xl font-bold text-amply-black mb-2 sm:mb-4">No Parties Found</h3>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              No parties match your current filters.
            </p>
            <Link href="/listening-party/create">
              <Button className="amply-button-primary px-6 sm:px-8 py-3 sm:py-4 rounded-2xl">
                <Plus className="w-4 h-4 mr-2" />
                Create the First Party
              </Button>
            </Link>
          </div>
        )}

        {/* History Link */}
        <div className="mt-12 text-center">
          <Link href="/listening-party/history">
            <Button variant="ghost" className="text-amply-orange hover:text-amply-pink font-medium">
              <TrendingUp className="w-4 h-4 mr-2" />
              Browse Past Parties & Playlists →
            </Button>
          </Link>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}