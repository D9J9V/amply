"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import WorldIdBadge from "@/components/world-id-badge"
import HumanVerifiedBadge from "@/components/human-verified-badge"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Heart,
  Share2,
  Users,
  Radio,
  Send,
  Star,
  ArrowLeft,
  Eye,
  MessageCircle,
  Music,
  X,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function LiveStreamPage() {
  const params = useParams()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [viewers, setViewers] = useState(1247)
  const [likes, setLikes] = useState(892)
  const [currentTime, setCurrentTime] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isChatVisible, setIsChatVisible] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Mock live stream data
  const streamData = {
    id: params.id,
    title: "DJ Nexus - Underground Vibes Live Set",
    artist: "DJ Nexus",
    description: "Live electronic set from the underground scene 🎧 Deep house & techno vibes",
    image: "/images/dj-performance.jpg",
    verified: true,
    humanVerified: true,
    category: "Electronic",
    startedAt: "1:12:45 ago",
    tags: ["Electronic", "House", "Techno", "Underground", "Live"],
  }

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: "MusicLover23",
      message: "This beat is incredible! 🔥",
      timestamp: "2 min ago",
      verified: true,
      humanVerified: true,
    },
    {
      id: 2,
      user: "VinylCollector",
      message: "What's the track ID?",
      timestamp: "1 min ago",
      verified: false,
      humanVerified: true,
    },
    {
      id: 3,
      user: "TechnoFan",
      message: "Best set I've heard all week!",
      timestamp: "30 sec ago",
      verified: true,
      humanVerified: false,
    },
    {
      id: 4,
      user: "BassHead",
      message: "Drop incoming... 🎵",
      timestamp: "10 sec ago",
      verified: false,
      humanVerified: true,
    },
  ])

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => prev + 1)
      setViewers((prev) => prev + Math.floor(Math.random() * 10) - 5)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timeout)
  }, [showControls])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: "You",
        message: chatMessage,
        timestamp: "now",
        verified: isConnected,
        humanVerified: isConnected,
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="min-h-screen bg-amply-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-amply-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button size="sm" variant="ghost" className="text-white hover:bg-gray-800 rounded-2xl p-3">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            {/* New Amply Logo */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D098F147-8781-4E47-9FB3-871FA7FD1553.PNG-qO8xf6BHvA7ldsKb1h9esV5l748Xuc.png"
              alt="Amply Logo"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="text-xl font-bold text-white">AMPLY</span>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-red-500 text-white px-4 py-2 rounded-2xl animate-pulse">
              <Radio className="w-4 h-4 mr-2" />
              LIVE
            </Badge>

            {isConnected ? (
              <HumanVerifiedBadge size="sm" />
            ) : (
              <Button
                onClick={() => setIsConnected(true)}
                className="amply-button-primary px-4 py-2 text-sm rounded-2xl"
              >
                Connect World ID
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="pt-20 grid grid-cols-1 lg:grid-cols-4 gap-0 h-screen">
        {/* Video Player */}
        <div className="lg:col-span-3 relative bg-black">
          <div
            className="relative h-full cursor-pointer"
            onClick={() => setShowControls(true)}
            onMouseMove={() => setShowControls(true)}
          >
            {/* Video/Stream */}
            <img
              src={streamData.image || "/placeholder.svg"}
              alt={streamData.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            {/* Stream Info Overlay */}
            <div className="absolute top-6 left-6 right-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-amply-orange text-white px-4 py-2 rounded-2xl">
                      <Music className="w-4 h-4 mr-2" />
                      Electronic
                    </Badge>
                    <Badge className="bg-red-500/90 text-white px-4 py-2 rounded-2xl backdrop-blur-sm">
                      <Eye className="w-4 h-4 mr-2" />
                      {viewers.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="space-y-4">
                {/* Artist Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-amply-orange to-amply-pink rounded-3xl flex items-center justify-center">
                    <Radio className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-white font-semibold text-xl">{streamData.artist}</h3>
                      {streamData.verified && (
                        <Badge className="bg-amply-orange/20 text-amply-orange border-amply-orange/50 text-sm px-3 py-1 rounded-full">
                          <Star className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {streamData.humanVerified && <WorldIdBadge size="sm" />}
                    </div>
                    <p className="text-white/90 font-medium text-lg">{streamData.title}</p>
                    <p className="text-white/70 text-sm">{streamData.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-white/70 text-sm">
                  <span className="flex items-center">
                    <Radio className="w-4 h-4 mr-2" />
                    Live for {formatTime(currentTime)}
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    {likes.toLocaleString()} likes
                  </span>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            {showControls && (
              <div className="absolute inset-0 bg-black/20">
                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full backdrop-blur-md transition-all"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </Button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-20 left-6 right-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:bg-white/20 rounded-2xl p-3"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>

                      <Button
                        onClick={handleLike}
                        className={`text-white hover:bg-white/20 rounded-2xl p-3 ${isLiked ? "text-red-500" : ""}`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                      </Button>

                      <Button className="text-white hover:bg-white/20 rounded-2xl p-3">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => setIsChatVisible(!isChatVisible)}
                        className="text-white hover:bg-white/20 rounded-2xl p-3 lg:hidden"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Button>

                      <Button onClick={toggleFullscreen} className="text-white hover:bg-white/20 rounded-2xl p-3">
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        <div
          className={`bg-amply-cream border-l border-gray-200 flex flex-col ${isChatVisible ? "block" : "hidden lg:flex"}`}
        >
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200 bg-amply-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-amply-black text-lg">Live Chat</h3>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  <Users className="w-3 h-3 mr-1" />
                  {viewers.toLocaleString()}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-500 hover:text-amply-black lg:hidden"
                  onClick={() => setIsChatVisible(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-amply-black text-sm">{message.user}</span>
                    {message.verified && (
                      <Badge className="bg-amply-orange/10 text-amply-orange text-xs px-2 py-0.5 rounded-full">
                        <Star className="w-2 h-2 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {message.humanVerified && <WorldIdBadge size="xs" />}
                    <span className="text-gray-500 text-xs">{message.timestamp}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{message.message}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-amply-white">
            {isConnected ? (
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-2xl border-gray-200 focus:border-amply-orange focus:ring-amply-orange"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="amply-button-primary rounded-2xl px-4"
                  disabled={!chatMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-gray-600 text-sm">Connect with World ID to join the chat</p>
                <Button onClick={() => setIsConnected(true)} className="amply-button-primary w-full rounded-2xl">
                  Connect World ID
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}