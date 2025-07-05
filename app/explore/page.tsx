"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorldIdBadge from "@/components/world-id-badge"
import HumanVerifiedBadge from "@/components/human-verified-badge"
import {
  Search,
  TrendingUp,
  Music,
  Radio,
  Zap,
  Users,
  Play,
  Heart,
  Share2,
  Star,
  Eye,
  Clock,
  Filter,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("trending")
  const [likedItems, setLikedItems] = useState<number[]>([])

  const handleLike = (itemId: number) => {
    setLikedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  // Trending content
  const trendingContent = [
    {
      id: 1,
      type: "music",
      title: "Midnight Dreams",
      artist: "Echo Valley",
      image: "/placeholder.svg?height=300&width=300&text=Midnight+Dreams",
      plays: 45230,
      likes: 2341,
      verified: true,
      humanVerified: true,
      trending: true,
      genre: "Electronic",
    },
    {
      id: 2,
      type: "drop",
      title: "Genesis Collection",
      artist: "Digital Waves",
      image: "/placeholder.svg?height=300&width=300&text=Genesis+Collection",
      price: "0.08 WLD",
      timeLeft: "3h 45m",
      verified: true,
      humanVerified: true,
      trending: true,
      rarity: "Legendary",
    },
    {
      id: 3,
      type: "live",
      title: "Acoustic Sunset Session",
      artist: "River Stone",
      image: "/placeholder.svg?height=300&width=300&text=Acoustic+Sunset",
      viewers: 1234,
      verified: false,
      humanVerified: true,
      trending: true,
      startedAt: "15 min ago",
    },
  ]

  // Featured artists
  const featuredArtists = [
    {
      id: 1,
      name: "Alex Rivera",
      followers: 12340,
      tracks: 24,
      image: "/placeholder.svg?height=200&width=200&text=Alex+Rivera",
      verified: true,
      humanVerified: true,
      genre: "Electronic",
      monthlyListeners: 45230,
    },
    {
      id: 2,
      name: "Maya Chen",
      followers: 8934,
      tracks: 18,
      image: "/placeholder.svg?height=200&width=200&text=Maya+Chen",
      verified: true,
      humanVerified: true,
      genre: "Indie Rock",
      monthlyListeners: 32100,
    },
    {
      id: 3,
      name: "Luna Waves",
      followers: 15670,
      tracks: 31,
      image: "/placeholder.svg?height=200&width=200&text=Luna+Waves",
      verified: true,
      humanVerified: true,
      genre: "Ambient",
      monthlyListeners: 67890,
    },
  ]

  // Genres
  const genres = [
    { name: "Electronic", count: 1234, color: "bg-purple-500", icon: "🎵" },
    { name: "Hip-Hop", count: 987, color: "bg-red-500", icon: "🎤" },
    { name: "Indie Rock", count: 756, color: "bg-blue-500", icon: "🎸" },
    { name: "Jazz", count: 543, color: "bg-yellow-500", icon: "🎺" },
    { name: "Ambient", count: 432, color: "bg-green-500", icon: "🌊" },
    { name: "Folk", count: 321, color: "bg-orange-500", icon: "🪕" },
  ]

  return (
    <div className="min-h-screen bg-amply-gradient pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-amply-white/95 backdrop-blur-md border-b border-gray-200 shadow-soft">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo Placeholder */}
              <div className="w-10 h-10 bg-amply-white rounded-xl shadow-card flex items-center justify-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D098F147-8781-4E47-9FB3-871FA7FD1553.PNG-qO8xf6BHvA7ldsKb1h9esV5l748Xuc.png"
                  alt="Amply Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amply-black">Explore</h1>
                <p className="text-sm text-gray-600">Discover human-verified music</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <HumanVerifiedBadge size="sm" />
              <Link href="/profile">
                <Button className="amply-button-primary px-6 py-2 rounded-xl">
                  <Users className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center bg-amply-gradient-soft text-white px-6 py-3 rounded-2xl shadow-amply mb-6">
            <Globe className="w-5 h-5 mr-2" />
            <span className="font-medium">DISCOVER HUMAN-VERIFIED MUSIC</span>
          </div>
          <h2 className="text-4xl font-bold text-amply-black mb-4">Explore the Future</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find authentic music from verified human creators. No bots, no algorithms - just real artists making real
            music.
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search artists, tracks, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-amply-white border-gray-200 text-amply-black placeholder-gray-400 py-3 rounded-2xl shadow-card"
            />
          </div>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl px-6 py-3 bg-transparent"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-2xl p-1 mb-8 border-0">
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-amply-gradient-soft data-[state=active]:text-white text-gray-600 font-medium rounded-xl py-3 transition-all"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="artists"
              className="data-[state=active]:bg-amply-gradient-soft data-[state=active]:text-white text-gray-600 font-medium rounded-xl py-3 transition-all"
            >
              <Users className="w-4 h-4 mr-2" />
              Artists
            </TabsTrigger>
            <TabsTrigger
              value="genres"
              className="data-[state=active]:bg-amply-gradient-soft data-[state=active]:text-white text-gray-600 font-medium rounded-xl py-3 transition-all"
            >
              <Music className="w-4 h-4 mr-2" />
              Genres
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-600 font-medium rounded-xl py-3 transition-all"
            >
              <Radio className="w-4 h-4 mr-2" />
              Live
            </TabsTrigger>
          </TabsList>

          {/* Trending Content */}
          <TabsContent value="trending" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingContent.map((item, index) => (
                <Card
                  key={item.id}
                  className="amply-card amply-card-hover rounded-3xl border-0 overflow-hidden group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Trending Badge */}
                    <Badge className="absolute top-4 left-4 bg-amply-gradient-soft text-white font-medium px-3 py-1 rounded-full shadow-soft">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>

                    {/* Type Badge */}
                    <Badge
                      className={`absolute top-4 right-4 text-white font-medium px-3 py-1 rounded-full shadow-soft ${
                        item.type === "music"
                          ? "bg-amply-orange"
                          : item.type === "drop"
                            ? "bg-amply-pink"
                            : "bg-red-500"
                      }`}
                    >
                      {item.type === "music" && <Music className="w-3 h-3 mr-1" />}
                      {item.type === "drop" && <Zap className="w-3 h-3 mr-1" />}
                      {item.type === "live" && <Radio className="w-3 h-3 mr-1" />}
                      {item.type === "music" ? "Music" : item.type === "drop" ? "Drop" : "Live"}
                    </Badge>

                    <Button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-amply-white/20 hover:bg-amply-white/30 text-white border-2 border-white/50 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                      <Play className="w-6 h-6 ml-1" />
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-amply-black mb-1">{item.title}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-gray-600 text-sm">by {item.artist}</span>
                          {item.verified && (
                            <Badge className="bg-amply-orange/20 text-amply-orange border-amply-orange/50 text-xs px-2 py-0.5 rounded-full">
                              <Star className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        {item.humanVerified && <WorldIdBadge size="sm" className="mb-3" />}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLike(item.id)}
                        className={`text-gray-400 hover:text-red-500 p-2 ${
                          likedItems.includes(item.id) ? "text-red-500" : ""
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedItems.includes(item.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      {item.type === "music" && (
                        <>
                          <span className="flex items-center">
                            <Play className="w-4 h-4 mr-1" />
                            {item.plays?.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {item.likes?.toLocaleString()}
                          </span>
                        </>
                      )}
                      {item.type === "drop" && (
                        <>
                          <span className="text-amply-pink font-semibold">{item.price}</span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {item.timeLeft}
                          </span>
                        </>
                      )}
                      {item.type === "live" && (
                        <>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {item.viewers?.toLocaleString()}
                          </span>
                          <span>Started {item.startedAt}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button className="amply-button-primary flex-1 py-2 rounded-xl">
                        <Play className="w-4 h-4 mr-2" />
                        {item.type === "music" ? "Play" : item.type === "drop" ? "View Drop" : "Join Live"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl p-2 bg-transparent"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Featured Artists */}
          <TabsContent value="artists" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArtists.map((artist, index) => (
                <Card
                  key={artist.id}
                  className="amply-card amply-card-hover rounded-3xl border-0 overflow-hidden group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-amply-black mb-1">{artist.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-gray-600 text-sm">{artist.genre}</span>
                          {artist.verified && (
                            <Badge className="bg-amply-orange/20 text-amply-orange border-amply-orange/50 text-xs px-2 py-0.5 rounded-full">
                              <Star className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        {artist.humanVerified && <WorldIdBadge size="sm" className="mb-3" />}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                      <div>
                        <span className="block font-medium text-amply-black">{artist.followers.toLocaleString()}</span>
                        <span>Followers</span>
                      </div>
                      <div>
                        <span className="block font-medium text-amply-black">{artist.tracks}</span>
                        <span>Tracks</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      <span className="font-medium text-amply-black">{artist.monthlyListeners.toLocaleString()}</span>{" "}
                      monthly listeners
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button className="amply-button-primary flex-1 py-2 rounded-xl">
                        <Users className="w-4 h-4 mr-2" />
                        Follow
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl p-2 bg-transparent"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Genres */}
          <TabsContent value="genres" className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {genres.map((genre, index) => (
                <Card
                  key={genre.name}
                  className="amply-card amply-card-hover rounded-3xl border-0 cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${genre.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform text-2xl`}
                    >
                      {genre.icon}
                    </div>
                    <h3 className="font-semibold text-amply-black mb-1">{genre.name}</h3>
                    <p className="text-sm text-gray-600">{genre.count} tracks</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Content */}
          <TabsContent value="live" className="space-y-8">
            <div className="text-center py-12">
              <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No live sessions right now</h3>
              <p className="text-gray-500 mb-6">Check back later for live performances from verified artists</p>
              <Link href="/live">
                <Button className="amply-button-primary px-6 py-3 rounded-xl">
                  <Radio className="w-4 h-4 mr-2" />
                  Browse Live Events
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}