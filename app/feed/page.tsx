"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Heart,
  Share2,
  Search,
  Users,
  Clock,
  Star,
  Zap,
  Globe,
  Music,
  Headphones,
  Download,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function FeedPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [likedTracks, setLikedTracks] = useState<number[]>([])

  // Simulate connection status
  useEffect(() => {
    const connected = Math.random() > 0.3
    setIsConnected(connected)
  }, [])

  const handleLike = (trackId: number) => {
    setLikedTracks((prev) => (prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]))
  }

  // Regular content - regular music
  const regularTracks = [
    {
      id: 1,
      title: "Summer Vibes",
      artist: "Alex Rivera",
      genre: "Pop",
      duration: "3:24",
      plays: 15420,
      likes: 892,
      image: "/placeholder.svg?height=200&width=200&text=Summer+Vibes",
      verified: false,
      price: "Free",
    },
    {
      id: 2,
      title: "Neon Nights",
      artist: "Maya Chen",
      genre: "Electronic",
      duration: "4:12",
      plays: 8934,
      likes: 567,
      image: "/placeholder.svg?height=200&width=200&text=Neon+Nights",
      verified: true,
      price: "Free",
    },
    {
      id: 3,
      title: "Acoustic Dreams",
      artist: "Jordan Smith",
      genre: "Folk",
      duration: "2:58",
      plays: 12340,
      likes: 743,
      image: "/placeholder.svg?height=200&width=200&text=Acoustic+Dreams",
      verified: false,
      price: "Free",
    },
    {
      id: 4,
      title: "City Lights",
      artist: "Luna Park",
      genre: "Indie",
      duration: "3:45",
      plays: 6789,
      likes: 432,
      image: "/placeholder.svg?height=200&width=200&text=City+Lights",
      verified: true,
      price: "Free",
    },
    {
      id: 5,
      title: "Midnight Jazz",
      artist: "The Blue Notes",
      genre: "Jazz",
      duration: "5:21",
      plays: 4567,
      likes: 321,
      image: "/placeholder.svg?height=200&width=200&text=Midnight+Jazz",
      verified: false,
      price: "Free",
    },
    {
      id: 6,
      title: "Digital Pulse",
      artist: "Cyber Wave",
      genre: "Electronic",
      duration: "3:33",
      plays: 9876,
      likes: 654,
      image: "/placeholder.svg?height=200&width=200&text=Digital+Pulse",
      verified: true,
      price: "Free",
    },
  ]

  // Exclusive drops - premium content
  const exclusiveDrops = [
    {
      id: 1,
      title: "Midnight Echoes",
      artist: "Luna Waves",
      image: "/placeholder.svg?height=300&width=300&text=Midnight+Echoes",
      listeners: 1203,
      timeLeft: "2h 15m",
      price: "0.05 WLD",
      verified: true,
      rarity: "Rare",
      benefits: ["Exclusive Chat", "Early Access", "NFT Artwork"],
    },
    {
      id: 2,
      title: "Digital Dreams",
      artist: "Neon Pulse",
      image: "/placeholder.svg?height=300&width=300&text=Digital+Dreams",
      listeners: 856,
      timeLeft: "5h 42m",
      price: "Free",
      verified: true,
      rarity: "Common",
      benefits: ["Exclusive Chat", "Behind the Scenes"],
    },
    {
      id: 3,
      title: "Urban Symphony",
      artist: "Street Harmony",
      image: "/placeholder.svg?height=300&width=300&text=Urban+Symphony",
      listeners: 2341,
      timeLeft: "1h 08m",
      price: "0.03 WLD",
      verified: true,
      rarity: "Epic",
      benefits: ["Exclusive Chat", "NFT Artwork", "Meet & Greet", "Signed Vinyl"],
    },
    {
      id: 4,
      title: "Cosmic Beats",
      artist: "Galaxy Sounds",
      image: "/placeholder.svg?height=300&width=300&text=Cosmic+Beats",
      listeners: 1876,
      timeLeft: "3h 29m",
      price: "0.08 WLD",
      verified: true,
      rarity: "Legendary",
      benefits: ["Exclusive Chat", "NFT Collection", "Private Concert", "Producer Credits"],
    },
  ]

  const genres = ["all", "Pop", "Electronic", "Folk", "Indie", "Jazz", "Hip-Hop", "Rock"]

  const filteredTracks = regularTracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === "all" || track.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-amply-beige text-amply-black"
      case "Rare":
        return "bg-amply-orange text-white"
      case "Epic":
        return "bg-amply-pink text-white"
      case "Legendary":
        return "bg-gradient-to-r from-amply-orange to-amply-pink text-white"
      default:
        return "bg-amply-beige text-amply-black"
    }
  }

  return (
    <div className="min-h-screen amply-gradient pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-amply-orange/20 backdrop-blur-md bg-amply-cream/90 sticky top-0 z-40 amply-shadow">
        <div className="mobile-padding mobile-padding-y">
          <div className="flex items-center justify-between mb-4 sm:mb-0">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              {/* Logo */}
              <div className="relative flex-shrink-0">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0555BDFA-33D3-42CA-B24D-CFC818AD0DCA-aLIacULdeAq40GKaGnUwHfT4k2Iniu.png"
                  alt="AMPLY Logo"
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover amply-shadow animate-gentle-float"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="amply-text-heading text-amply-black text-xl sm:text-3xl truncate">AMPLY</span>
                <span className="amply-text-body text-amply-orange text-xs sm:text-sm font-semibold hidden sm:block">
                  Authentic Music
                </span>
              </div>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link
                href="/"
                className="text-amply-black/70 hover:text-amply-orange transition-colors amply-text-body font-semibold"
              >
                Home
              </Link>
              <Link href="/feed" className="text-amply-orange amply-text-heading font-bold">
                Explore
              </Link>
              <Link
                href="/live"
                className="text-amply-black/70 hover:text-amply-orange transition-colors amply-text-body font-semibold"
              >
                Live
              </Link>
              <Link
                href="/artist"
                className="text-amply-black/70 hover:text-amply-orange transition-colors amply-text-body font-semibold"
              >
                For Artists
              </Link>

              {/* Add button */}
              <div className="relative">
                <Button className="w-12 h-12 bg-gradient-to-r from-amply-orange to-amply-pink hover:from-amply-pink hover:to-amply-orange text-white border-0 rounded-full amply-shadow-lg transform hover:scale-110 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-soft-pulse rounded-full"></div>
                  <Plus className="w-6 h-6 relative z-10" />
                </Button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amply-pink rounded-full animate-gentle-float"></div>
              </div>
            </nav>

            {/* User Status - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {isConnected ? (
                <>
                  <Badge className="bg-amply-orange/20 text-amply-orange border-amply-orange/30 amply-text-body px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Verified Human</span>
                    <span className="sm:hidden">Human</span>
                  </Badge>
                  <Link href="/profile" className="hidden sm:block">
                    <Button className="border-2 border-amply-orange text-amply-orange hover:bg-amply-orange hover:text-white amply-text-body font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-transparent transition-all">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      <span className="hidden lg:inline">My Profile</span>
                      <span className="lg:hidden">Profile</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <Button className="amply-button-primary px-3 sm:px-8 py-2 sm:py-4 text-sm sm:text-lg touch-target">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Connect World ID</span>
                  <span className="sm:hidden">Connect</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-padding mobile-padding-y space-y-6 sm:space-y-12">
        <div className="mb-6 sm:mb-12">
          <h1 className="amply-text-heading text-amply-black text-3xl sm:text-4xl lg:text-6xl mb-2 sm:mb-4">
            Explore Music
          </h1>
          <p className="amply-text-body text-amply-black/70 text-lg sm:text-xl lg:text-2xl">
            Discover new music and exclusive drops
          </p>
        </div>

        {/* Tabs to separate content */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-amply-beige/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2 sm:p-3 amply-shadow border-2 border-amply-orange/20">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-amply-orange data-[state=active]:text-white text-amply-black amply-text-body font-semibold rounded-xl sm:rounded-2xl py-3 sm:py-4 text-sm sm:text-lg transition-all"
            >
              <Music className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">General Music</span>
              <span className="sm:hidden">Music</span>
            </TabsTrigger>
            <TabsTrigger
              value="drops"
              className="data-[state=active]:bg-amply-pink data-[state=active]:text-white text-amply-black amply-text-body font-semibold rounded-xl sm:rounded-2xl py-3 sm:py-4 text-sm sm:text-lg transition-all"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Exclusive Drops</span>
              <span className="sm:hidden">Drops</span>
            </TabsTrigger>
          </TabsList>

          {/* General Content */}
          <TabsContent value="general" className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
            {/* Search and Filters */}
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-amply-orange w-4 h-4 sm:w-6 sm:h-6" />
                <Input
                  placeholder="Search songs, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 sm:pl-14 bg-amply-cream border-2 border-amply-orange/30 text-amply-black placeholder-amply-black/50 amply-text-body py-3 sm:py-5 rounded-2xl amply-shadow text-base sm:text-lg touch-target"
                />
              </div>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGenre(genre)}
                    className={`whitespace-nowrap amply-text-body font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all touch-target text-sm sm:text-base ${
                      selectedGenre === genre
                        ? "amply-button-primary"
                        : "border-2 border-amply-orange text-amply-orange hover:bg-amply-orange hover:text-white bg-transparent"
                    }`}
                  >
                    {genre === "all" ? "All" : genre}
                  </Button>
                ))}
              </div>
            </div>

            {/* Regular Music Grid */}
            <div className="grid-mobile-responsive">
              {filteredTracks.map((track, index) => (
                <Card
                  key={track.id}
                  className="amply-card hover:amply-shadow-lg transition-all duration-300 group overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="relative mb-4 sm:mb-6">
                      <img
                        src={track.image || "/placeholder.svg"}
                        alt={track.title}
                        className="w-full h-40 sm:h-48 object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-amply-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button className="amply-button-primary px-4 sm:px-6 py-2 sm:py-3 touch-target">
                          <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Play
                        </Button>
                      </div>
                      <Badge className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-amply-orange text-white amply-text-body px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                        {track.genre}
                      </Badge>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="amply-text-heading text-amply-black text-lg sm:text-xl mb-1 sm:mb-2 line-clamp-1">
                          {track.title}
                        </h3>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <p className="amply-text-body text-amply-black/70 text-base sm:text-lg">{track.artist}</p>
                          {track.verified && (
                            <Badge className="bg-amply-orange/20 text-amply-orange border-0 amply-text-body text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between amply-text-body text-amply-black/60 text-sm sm:text-base">
                        <div className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto">
                          <span className="flex items-center flex-shrink-0">
                            <Headphones className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                            {track.plays.toLocaleString()}
                          </span>
                          <span className="flex items-center flex-shrink-0">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                            {track.duration}
                          </span>
                        </div>
                        <span className="amply-text-heading text-amply-black flex-shrink-0">{track.price}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleLike(track.id)}
                            className={`text-amply-black/60 hover:text-amply-orange transition-colors p-2 touch-target ${
                              likedTracks.includes(track.id) ? "text-amply-orange" : ""
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${likedTracks.includes(track.id) ? "fill-current" : ""}`}
                            />
                            <span className="ml-1 sm:ml-2 text-xs sm:text-sm">{track.likes}</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-amply-black/60 hover:text-amply-orange transition-colors p-2 touch-target"
                          >
                            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        </div>
                        <Button className="amply-button-primary px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base touch-target">
                          <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                          Listen
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Exclusive Drops */}
          <TabsContent value="drops" className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="amply-text-heading text-amply-black text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4">
                Exclusive Drops
              </h2>
              <p className="amply-text-body text-amply-black/70 text-lg sm:text-xl">
                Only for verified humans • Limited time
              </p>
              {!isConnected && (
                <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-amply-orange/10 border-2 border-amply-orange/30 rounded-2xl">
                  <p className="amply-text-body text-amply-black text-sm sm:text-base">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                    Connect your World ID to access exclusive drops
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {exclusiveDrops.map((drop, index) => (
                <Card
                  key={drop.id}
                  className="amply-card hover:amply-shadow-lg transition-all duration-300 group overflow-hidden"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <CardContent className="p-6 sm:p-8">
                    <div className="relative mb-4 sm:mb-6">
                      <img
                        src={drop.image || "/placeholder.svg"}
                        alt={drop.title}
                        className="w-full h-56 sm:h-64 object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-2xl"></div>
                      <Badge className={`absolute top-4 left-4 ${getRarityColor(drop.rarity)} px-4 py-2 rounded-full`}>
                        {drop.rarity}
                      </Badge>
                      {drop.timeLeft && (
                        <Badge className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full animate-pulse">
                          <Clock className="w-4 h-4 mr-2" />
                          {drop.timeLeft}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-amply-black mb-2">{drop.title}</h3>
                        <p className="text-lg text-amply-black/70">{drop.artist}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-amply-orange" />
                          <span className="text-amply-black/60">{drop.listeners} listening</span>
                        </div>
                        <span className="text-2xl font-bold text-amply-orange">{drop.price}</span>
                      </div>

                      {drop.benefits && (
                        <div className="flex flex-wrap gap-2">
                          {drop.benefits.map((benefit, i) => (
                            <Badge key={i} className="bg-amply-cream text-amply-black border-amply-orange/30">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Button
                        className="w-full amply-button-secondary py-4 text-lg"
                        disabled={!isConnected}
                      >
                        {isConnected ? (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Get Drop
                          </>
                        ) : (
                          <>
                            <Globe className="w-5 h-5 mr-2" />
                            Connect to Access
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}