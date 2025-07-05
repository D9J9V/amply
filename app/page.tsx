"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorldIdBadge from "@/components/world-id-badge"
import HumanVerifiedBadge from "@/components/human-verified-badge"
import WorldIdOnboardingModal from "@/components/world-id-onboarding-modal"
import {
  Play,
  Pause,
  Heart,
  Share2,
  Users,
  Star,
  Zap,
  Globe,
  Music,
  Radio,
  Volume2,
  VolumeX,
  MoreHorizontal,
  MessageCircle,
  Clock,
  Eye,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  Sparkles,
  BookOpen,
  Search,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null)
  const [likedItems, setLikedItems] = useState<number[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [visibleItems, setVisibleItems] = useState(10)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("for-you")
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<HTMLDivElement>(null)

  // Show onboarding modal on first load
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("amply-onboarding-seen")
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleItems((prev) => prev + 5)
        }
      },
      { threshold: 1.0 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Track current visible item
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop
        const itemHeight = window.innerHeight
        const newIndex = Math.round(scrollTop / itemHeight)
        setCurrentIndex(newIndex)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLike = (itemId: number) => {
    setLikedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handlePlay = (itemId: number) => {
    setCurrentPlaying(currentPlaying === itemId ? null : itemId)
  }

  const handleWorldIdConnect = () => {
    setIsConnected(true)
    localStorage.setItem("amply-onboarding-seen", "true")
    console.log("Connecting to World ID...")
  }

  const handleWorldIdSkip = () => {
    localStorage.setItem("amply-onboarding-seen", "true")
    console.log("User skipped World ID verification")
  }

  const scrollToNext = () => {
    if (containerRef.current && currentIndex < visibleItems - 1) {
      const nextIndex = currentIndex + 1
      containerRef.current.scrollTo({
        top: nextIndex * window.innerHeight,
        behavior: "smooth",
      })
    }
  }

  const scrollToPrev = () => {
    if (containerRef.current && currentIndex > 0) {
      const prevIndex = currentIndex - 1
      containerRef.current.scrollTo({
        top: prevIndex * window.innerHeight,
        behavior: "smooth",
      })
    }
  }

  // Feed items - mix of music, drops, and live events
  const allFeedItems = [
    {
      id: 1,
      type: "music",
      title: "Summer Vibes",
      artist: "Alex Rivera",
      image: "/images/vinyl-record.jpg",
      duration: "3:24",
      plays: 15420,
      likes: 892,
      verified: false,
      price: "Free",
      description:
        "Perfect soundtrack for sunny days ☀️ Classic vinyl vibes with modern production #SummerVibes #ChillMusic #Vinyl",
      category: "trending",
      humanVerified: true,
    },
    {
      id: 2,
      type: "drop",
      title: "Midnight Echoes NFT",
      artist: "Luna Waves",
      image: "/placeholder.svg?height=800&width=400&text=Midnight+Echoes",
      timeLeft: "2h 15m",
      price: "0.05 WLD",
      verified: true,
      rarity: "Rare",
      listeners: 1203,
      description: "Exclusive drop with special benefits 🎵 Limited edition only 100 pieces! #NFTDrop #Exclusive",
      benefits: ["VIP Access", "High Quality Download", "Exclusive Chat"],
      category: "drops",
      humanVerified: true,
    },
    {
      id: 3,
      type: "live",
      title: "Acoustic Sessions Vol. 3",
      artist: "River Stone",
      image: "/placeholder.svg?height=800&width=400&text=Acoustic+Sessions",
      viewers: 234,
      verified: false,
      startedAt: "5 min ago",
      description: "Live acoustic session from the studio 🎸 Taking requests in chat! #LiveMusic #Acoustic",
      features: ["Chat", "Tips"],
      category: "live",
      humanVerified: true,
    },
    {
      id: 4,
      type: "music",
      title: "Neon Nights",
      artist: "Maya Chen",
      image: "/placeholder.svg?height=800&width=400&text=Neon+Nights",
      duration: "4:12",
      plays: 8934,
      likes: 567,
      verified: true,
      price: "Free",
      description: "Electronic vibes for the night owls 🌙 Perfect for late night drives #Electronic #NightVibes",
      category: "music",
      humanVerified: true,
    },
    {
      id: 5,
      type: "drop",
      title: "Urban Symphony",
      artist: "Street Harmony",
      image: "/placeholder.svg?height=800&width=400&text=Urban+Symphony",
      timeLeft: "1h 08m",
      price: "0.03 WLD",
      verified: true,
      rarity: "Epic",
      listeners: 2341,
      description: "Limited edition urban beats collection 🏙️ Only 50 copies available! #UrbanMusic #LimitedEdition",
      benefits: ["NFT Artwork", "Meet & Greet", "Signed Vinyl"],
      category: "drops",
      humanVerified: true,
    },
  ]

  // Filter items based on active tab
  const getFilteredItems = () => {
    switch (activeTab) {
      case "music":
        return allFeedItems.filter((item) => item.type === "music")
      case "drops":
        return allFeedItems.filter((item) => item.type === "drop")
      case "live":
        return allFeedItems.filter((item) => item.type === "live")
      case "trending":
        return allFeedItems.filter((item) => item.category === "trending")
      default:
        return allFeedItems // For You - show all
    }
  }

  const feedItems = getFilteredItems().slice(0, visibleItems)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "music":
        return Music
      case "drop":
        return Zap
      case "live":
        return Radio
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
      default:
        return "bg-amply-orange"
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-amply-cream relative">
      {/* World ID Onboarding Modal */}
      <WorldIdOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onConnect={handleWorldIdConnect}
        onSkip={handleWorldIdSkip}
      />

      {/* Header with Tabs - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-amply-white/95 backdrop-blur-md border-b border-gray-100 shadow-soft safe-area-top">
        <div className="mobile-padding mobile-padding-y">
          <div className="flex items-center justify-between mb-4 sm:mb-0">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              {/* Logo - optimized for mobile */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D098F147-8781-4E47-9FB3-871FA7FD1553.PNG-qO8xf6BHvA7ldsKb1h9esV5l748Xuc.png"
                alt="Amply Logo"
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shadow-card flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-lg sm:text-2xl font-bold text-amply-black tracking-tight block truncate">
                  AMPLY
                </span>
                <div className="text-xs gradient-text font-semibold hidden sm:block">THE FUTURE OF MUSIC IS HUMAN</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {isConnected ? (
                <HumanVerifiedBadge size="sm" />
              ) : (
                <Button
                  onClick={() => setShowOnboarding(true)}
                  className="amply-button-primary px-3 sm:px-6 py-2 text-xs sm:text-sm rounded-2xl touch-target"
                >
                  <Globe className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Connect</span>
                  <span className="xs:hidden">ID</span>
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-500 hover:text-amply-orange hover:bg-gray-50 rounded-2xl p-2 sm:p-3 touch-target"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Tabs Section - Mobile optimized */}
          <div className="mt-4 sm:mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-50 rounded-2xl sm:rounded-3xl p-1 sm:p-2 border-0 h-auto">
                <TabsTrigger
                  value="for-you"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amply-orange data-[state=active]:to-amply-pink data-[state=active]:text-white text-gray-600 font-medium rounded-xl sm:rounded-2xl py-2 sm:py-3 text-xs sm:text-sm transition-all"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="truncate">You</span>
                </TabsTrigger>
                <TabsTrigger
                  value="trending"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amply-orange data-[state=active]:to-amply-pink data-[state=active]:text-white text-gray-600 font-medium rounded-xl sm:rounded-2xl py-2 sm:py-3 text-xs sm:text-sm transition-all"
                >
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="truncate">Top</span>
                </TabsTrigger>
                <TabsTrigger
                  value="music"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amply-orange data-[state=active]:to-amply-pink data-[state=active]:text-white text-gray-600 font-medium rounded-xl sm:rounded-2xl py-2 sm:py-3 text-xs sm:text-sm transition-all"
                >
                  <Music className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="truncate">Music</span>
                </TabsTrigger>
                <TabsTrigger
                  value="drops"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amply-orange data-[state=active]:to-amply-pink data-[state=active]:text-white text-gray-600 font-medium rounded-xl sm:rounded-2xl py-2 sm:py-3 text-xs sm:text-sm transition-all"
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="truncate">Drops</span>
                </TabsTrigger>
                <TabsTrigger
                  value="live"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-gray-600 font-medium rounded-xl sm:rounded-2xl py-2 sm:py-3 text-xs sm:text-sm transition-all"
                >
                  <Radio className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="truncate">Live</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Desktop Navigation Buttons - Hidden on mobile */}
            <div className="hidden lg:flex items-center justify-center space-x-4 mt-4">
              <Link href="/explore">
                <Button className="amply-button-outline px-6 py-2 rounded-2xl">
                  <Search className="w-4 h-4 mr-2" />
                  Explore
                </Button>
              </Link>

              <Link href="/library">
                <Button className="amply-button-outline px-6 py-2 rounded-2xl">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Library
                </Button>
              </Link>

              <Link href="/profile">
                <Button className="amply-button-primary px-6 py-2 rounded-2xl">
                  <Users className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Arrows - Hidden on mobile */}
      <div className="hidden md:flex fixed right-8 top-1/2 transform -translate-y-1/2 z-40 flex-col space-y-4">
        <Button
          onClick={scrollToPrev}
          disabled={currentIndex === 0}
          className="w-14 h-14 bg-amply-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-3xl disabled:opacity-30 transition-all shadow-card hover:shadow-card-hover"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
        <Button
          onClick={scrollToNext}
          disabled={currentIndex >= feedItems.length - 1}
          className="w-14 h-14 bg-amply-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-3xl disabled:opacity-30 transition-all shadow-card hover:shadow-card-hover"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="fixed right-4 md:right-8 bottom-20 md:bottom-32 z-40 flex flex-col space-y-3">
        {feedItems.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-10 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-gradient-to-b from-amply-orange to-amply-pink shadow-amply" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Feed Container - Snap Scroll */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingTop: "140px", // Increased for mobile header
        }}
      >
        {feedItems.map((item) => {
          const TypeIcon = getTypeIcon(item.type)
          const isPlaying = currentPlaying === item.id
          const isLiked = likedItems.includes(item.id)

          return (
            <div
              key={item.id}
              className="snap-start snap-always relative"
              style={{
                height: "100vh",
                paddingTop: "160px",
                paddingBottom: "100px",
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40"></div>
              </div>

              {/* Content Overlay */}
              <div
                className="absolute inset-0 flex flex-col justify-between"
                style={{
                  paddingTop: "140px", // Account for header
                  paddingBottom: "120px", // Account for bottom nav
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
              >
                {/* Top Info */}
                <div className="flex items-start justify-between pt-4 sm:pt-6">
                  <Badge
                    className={`${getTypeColor(item.type)} text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl shadow-soft text-xs sm:text-sm`}
                  >
                    <TypeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {item.type === "music" ? "Music" : item.type === "drop" ? "Drop" : "Live"}
                  </Badge>

                  {item.type === "live" && (
                    <Badge className="bg-red-500 text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl animate-soft-pulse shadow-soft text-xs sm:text-sm">
                      <Radio className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      LIVE
                    </Badge>
                  )}

                  {item.type === "drop" && item.timeLeft && (
                    <Badge className="bg-amply-pink text-white font-semibold px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl animate-soft-pulse shadow-soft text-xs sm:text-sm">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {item.timeLeft}
                    </Badge>
                  )}
                </div>

                {/* Center Play Button */}
                <div className="flex-1 flex items-center justify-center">
                  <Button
                    onClick={() => handlePlay(item.id)}
                    className="w-20 h-20 sm:w-28 sm:h-28 bg-amply-white/20 hover:bg-amply-white/30 text-white border-2 border-white/50 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-soft touch-target"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 sm:w-12 sm:h-12" />
                    ) : (
                      <Play className="w-8 h-8 sm:w-12 sm:h-12 ml-1" />
                    )}
                  </Button>
                </div>

                {/* Bottom Content */}
                <div className="space-y-3 sm:space-y-6 pb-4 sm:pb-6">
                  {/* Artist Info */}
                  <div className="flex items-center space-x-3 sm:space-x-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-amply-orange to-amply-pink rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-soft flex-shrink-0">
                      <Music className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2 flex-wrap">
                        <h3 className="text-white font-semibold text-sm sm:text-xl truncate">{item.artist}</h3>
                        {item.verified && (
                          <Badge className="bg-amply-orange/20 text-amply-orange border-amply-orange/50 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                            <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {item.humanVerified && <WorldIdBadge size="sm" className="flex-shrink-0" />}
                      </div>
                      <p className="text-white/90 font-medium text-lg sm:text-2xl line-clamp-1">{item.title}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base line-clamp-2">{item.description}</p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 sm:space-x-6 text-white/70 text-xs sm:text-sm overflow-x-auto">
                    {item.type === "music" && (
                      <>
                        <span className="flex items-center flex-shrink-0">
                          <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {item.plays?.toLocaleString()}
                        </span>
                        <span className="flex items-center flex-shrink-0">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {item.duration}
                        </span>
                      </>
                    )}

                    {item.type === "drop" && (
                      <>
                        <span className="flex items-center flex-shrink-0">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {item.listeners?.toLocaleString()}
                        </span>
                        <span className="text-amply-orange font-semibold text-base sm:text-xl flex-shrink-0">
                          {item.price}
                        </span>
                      </>
                    )}

                    {item.type === "live" && (
                      <>
                        <span className="flex items-center flex-shrink-0">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {item.viewers?.toLocaleString()}
                        </span>
                        <span className="flex-shrink-0">Started {item.startedAt}</span>
                      </>
                    )}
                  </div>

                  {/* Benefits for drops - Hidden on small screens */}
                  {item.type === "drop" && item.benefits && (
                    <div className="hidden sm:flex flex-wrap gap-3">
                      {item.benefits.slice(0, 3).map((benefit, idx) => (
                        <Badge
                          key={idx}
                          className="bg-white/20 text-white border-white/30 text-sm px-4 py-2 rounded-2xl backdrop-blur-md"
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLike(item.id)}
                        className={`text-white hover:bg-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 transition-all touch-target ${
                          isLiked ? "text-red-500" : ""
                        }`}
                      >
                        <Heart className={`w-5 h-5 sm:w-7 sm:h-7 ${isLiked ? "fill-current" : ""}`} />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 touch-target"
                      >
                        <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 touch-target"
                      >
                        <Share2 className="w-5 h-5 sm:w-7 sm:h-7" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="hidden md:flex text-white hover:bg-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 touch-target"
                      >
                        <MoreHorizontal className="w-5 h-5 sm:w-7 sm:h-7" />
                      </Button>
                    </div>

                    {/* Main Action */}
                    {item.type === "drop" && isConnected ? (
                      <Button className="amply-button-secondary px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-2xl sm:rounded-3xl touch-target">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Buy Drop
                      </Button>
                    ) : item.type === "live" ? (
                      <Link href={`/live/${item.id}`}>
                        <Button className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-2xl sm:rounded-3xl shadow-soft touch-target">
                          <Radio className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Join Live
                        </Button>
                      </Link>
                    ) : (
                      <Button className="amply-button-primary px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-2xl sm:rounded-3xl touch-target">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Play
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Loading Trigger */}
        <div ref={observerRef} className="h-4" />
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
  )
}