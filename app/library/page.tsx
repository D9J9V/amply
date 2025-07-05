"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Search,
  Music,
  Heart,
  Clock,
  Play,
  Pause,
  MoreHorizontal,
  Users,
  Star,
  Zap,
  Radio,
  Download,
  Share2,
  Trash2,
  Plus,
  Filter,
} from "lucide-react"
import Link from "next/link"
import WorldIdBadge from "@/components/world-id-badge"

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const handlePlay = (itemId: number) => {
    setCurrentPlaying(currentPlaying === itemId ? null : itemId)
  }

  const toggleSelection = (itemId: number) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  // Library items - mix of saved music, purchased drops, and playlists
  const libraryItems = {
    liked: [
      {
        id: 1,
        type: "music",
        title: "Summer Vibes",
        artist: "Alex Rivera",
        image: "/placeholder.svg?height=300&width=300&text=Summer+Vibes",
        duration: "3:24",
        addedAt: "2 days ago",
        verified: false,
        humanVerified: true,
      },
      {
        id: 2,
        type: "music",
        title: "Neon Nights",
        artist: "Maya Chen",
        image: "/placeholder.svg?height=300&width=300&text=Neon+Nights",
        duration: "4:12",
        addedAt: "1 week ago",
        verified: true,
        humanVerified: true,
      },
    ],
    purchased: [
      {
        id: 3,
        type: "drop",
        title: "Midnight Echoes NFT",
        artist: "Luna Waves",
        image: "/placeholder.svg?height=300&width=300&text=Midnight+Echoes",
        price: "0.05 WLD",
        purchasedAt: "3 days ago",
        rarity: "Rare",
        verified: true,
        humanVerified: true,
      },
    ],
    playlists: [
      {
        id: 4,
        type: "playlist",
        title: "Human-Created Chill Vibes",
        creator: "You",
        image: "/placeholder.svg?height=300&width=300&text=Chill+Vibes",
        trackCount: 12,
        duration: "45 min",
        createdAt: "1 week ago",
        humanVerified: true,
      },
      {
        id: 5,
        type: "playlist",
        title: "Verified Artists Only",
        creator: "You",
        image: "/placeholder.svg?height=300&width=300&text=Verified+Artists",
        trackCount: 8,
        duration: "32 min",
        createdAt: "2 weeks ago",
        humanVerified: true,
      },
    ],
    recent: [
      {
        id: 6,
        type: "live",
        title: "Acoustic Sessions Vol. 3",
        artist: "River Stone",
        image: "/placeholder.svg?height=300&width=300&text=Acoustic+Sessions",
        watchedAt: "Yesterday",
        duration: "1:23:45",
        verified: false,
        humanVerified: true,
      },
    ],
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "music":
        return Music
      case "drop":
        return Zap
      case "live":
        return Radio
      case "playlist":
        return BookOpen
      default:
        return Music
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "music":
        return "bg-amply-orange"
      case "drop":
        return "bg-amply-pink"
      case "live":
        return "bg-red-500"
      case "playlist":
        return "bg-purple-500"
      default:
        return "bg-amply-orange"
    }
  }

  return (
    <div className="min-h-screen bg-amply-cream pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-amply-white/95 backdrop-blur-md border-b border-gray-100 shadow-soft">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D098F147-8781-4E47-9FB3-871FA7FD1553.PNG-qO8xf6BHvA7ldsKb1h9esV5l748Xuc.png"
              alt="Amply Logo"
              className="w-12 h-12 rounded-2xl object-cover shadow-card"
            />
            <div>
              <span className="text-2xl font-bold text-amply-black tracking-tight">AMPLY</span>
              <div className="text-xs gradient-text font-semibold">THE FUTURE OF MUSIC IS HUMAN</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/feed" className="text-gray-600 hover:text-amply-orange transition-colors font-medium">
              Explore
            </Link>
            <Link href="/live" className="text-gray-600 hover:text-amply-orange transition-colors font-medium">
              Live
            </Link>
            <Link href="/library" className="text-amply-orange font-semibold">
              Library
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <WorldIdBadge size="sm" />
            <Link href="/profile">
              <Button className="amply-button-primary px-6 py-2 rounded-2xl">
                <Users className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="container mx-auto px-6 pb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-gray-50 border-0 rounded-2xl py-3"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button className="amply-button-outline px-6 py-3 rounded-2xl">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            {selectedItems.length > 0 && (
              <Button className="amply-button-secondary px-6 py-3 rounded-2xl">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedItems.length})
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amply-black mb-4">Your Library</h1>
          <p className="text-xl text-gray-600">
            All your saved music, purchased drops, and created playlists in one place
          </p>
        </div>

        {/* Library Tabs */}
        <Tabs defaultValue="liked" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-50 rounded-3xl p-2 mb-8">
            <TabsTrigger value="liked" className="rounded-2xl py-3">
              <Heart className="w-4 h-4 mr-2" />
              Liked
            </TabsTrigger>
            <TabsTrigger value="purchased" className="rounded-2xl py-3">
              <Zap className="w-4 h-4 mr-2" />
              Purchased
            </TabsTrigger>
            <TabsTrigger value="playlists" className="rounded-2xl py-3">
              <BookOpen className="w-4 h-4 mr-2" />
              Playlists
            </TabsTrigger>
            <TabsTrigger value="recent" className="rounded-2xl py-3">
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </TabsTrigger>
          </TabsList>

          {/* Liked Music */}
          <TabsContent value="liked" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amply-black">Liked Music</h2>
              <Badge className="bg-amply-orange/20 text-amply-orange border-0">
                {libraryItems.liked.length} tracks
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryItems.liked.map((item) => {
                const TypeIcon = getTypeIcon(item.type)
                const isPlaying = currentPlaying === item.id
                const isSelected = selectedItems.includes(item.id)

                return (
                  <div
                    key={item.id}
                    className={`bg-amply-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer ${
                      isSelected ? "ring-2 ring-amply-orange" : ""
                    }`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    <div className="relative aspect-square">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />

                      <Badge
                        className={`absolute top-4 left-4 ${getTypeColor(item.type)} text-white px-3 py-1 rounded-2xl`}
                      >
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {item.type}
                      </Badge>

                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlay(item.id)
                          }}
                          className="w-16 h-16 bg-amply-white/20 hover:bg-amply-white/30 text-white border-0 rounded-full backdrop-blur-md"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-amply-black line-clamp-1">{item.title}</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          className="text-gray-400 hover:text-gray-600 p-2"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <p className="text-gray-600">{item.artist}</p>
                        {item.verified && <Star className="w-4 h-4 text-amply-orange" />}
                        {item.humanVerified && <WorldIdBadge size="sm" />}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{item.duration}</span>
                        <span>Added {item.addedAt}</span>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlay(item.id)
                          }}
                          className="flex-1 amply-button-primary py-2 rounded-2xl"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-2xl"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-2xl"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* Purchased Drops */}
          <TabsContent value="purchased" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amply-black">Purchased Drops</h2>
              <Badge className="bg-amply-pink/20 text-amply-pink border-0">{libraryItems.purchased.length} items</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryItems.purchased.map((item) => (
                <div
                  key={item.id}
                  className="bg-amply-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className="relative aspect-square">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />

                    <Badge className="absolute top-4 left-4 bg-amply-pink text-white px-3 py-1 rounded-2xl">
                      <Zap className="w-3 h-3 mr-1" />
                      NFT
                    </Badge>

                    <Badge className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-2xl">
                      {item.rarity}
                    </Badge>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-amply-black">{item.title}</h3>

                    <div className="flex items-center space-x-2">
                      <p className="text-gray-600">{item.artist}</p>
                      {item.verified && <Star className="w-4 h-4 text-amply-orange" />}
                      {item.humanVerified && <WorldIdBadge size="sm" />}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="text-amply-pink font-semibold">{item.price}</span>
                      <span>Purchased {item.purchasedAt}</span>
                    </div>

                    <Button className="w-full amply-button-secondary py-2 rounded-2xl">
                      <Download className="w-4 h-4 mr-2" />
                      Download Assets
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Playlists */}
          <TabsContent value="playlists" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amply-black">Your Playlists</h2>
              <Button className="amply-button-primary px-6 py-2 rounded-2xl">
                <Plus className="w-4 h-4 mr-2" />
                Create Playlist
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryItems.playlists.map((item) => (
                <div
                  key={item.id}
                  className="bg-amply-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer"
                >
                  <div className="relative aspect-square">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />

                    <Badge className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-2xl">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Playlist
                    </Badge>

                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Button className="w-16 h-16 bg-amply-white/20 hover:bg-amply-white/30 text-white border-0 rounded-full backdrop-blur-md">
                        <Play className="w-6 h-6 ml-1" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-amply-black">{item.title}</h3>

                    <div className="flex items-center space-x-2">
                      <p className="text-gray-600">by {item.creator}</p>
                      {item.humanVerified && <WorldIdBadge size="sm" />}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{item.trackCount} tracks</span>
                      <span>{item.duration}</span>
                    </div>

                    <p className="text-xs text-gray-500">Created {item.createdAt}</p>

                    <Button className="w-full amply-button-primary py-2 rounded-2xl">
                      <Play className="w-4 h-4 mr-2" />
                      Play Playlist
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Recent */}
          <TabsContent value="recent" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amply-black">Recently Played</h2>
              <Badge className="bg-gray-200 text-gray-700 border-0">{libraryItems.recent.length} items</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraryItems.recent.map((item) => {
                const TypeIcon = getTypeIcon(item.type)

                return (
                  <div
                    key={item.id}
                    className="bg-amply-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />

                      <Badge
                        className={`absolute top-4 left-4 ${getTypeColor(item.type)} text-white px-3 py-1 rounded-2xl`}
                      >
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {item.type}
                      </Badge>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-bold text-amply-black">{item.title}</h3>

                      <div className="flex items-center space-x-2">
                        <p className="text-gray-600">{item.artist}</p>
                        {item.verified && <Star className="w-4 h-4 text-amply-orange" />}
                        {item.humanVerified && <WorldIdBadge size="sm" />}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{item.duration}</span>
                        <span>Watched {item.watchedAt}</span>
                      </div>

                      <Button className="w-full amply-button-primary py-2 rounded-2xl">
                        <Play className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}