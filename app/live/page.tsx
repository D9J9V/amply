"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Radio, Calendar, Clock, Eye, Star, Zap, Gift, TrendingUp, Shield, Globe } from "lucide-react"
import WorldIdBadge from "@/components/world-id-badge"
import { useWorldId } from "@/contexts/world-id-context"
import { Card, CardContent } from "@/components/ui/card"

export default function LivePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cardInView, setCardInView] = useState<number[]>([])
  const { isVerified, verifyHuman, verificationLoading } = useWorldId()

  const router = useRouter()

  // Trigger verification on page load if not verified
  useEffect(() => {
    if (!isVerified) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        verifyHuman('live-page-access')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isVerified, verifyHuman])

  const categories = [
    { id: "all", label: "All", count: 12 },
    { id: "premiere", label: "Premieres", count: 4 },
    { id: "concert", label: "Concerts", count: 3 },
    { id: "dj-set", label: "DJ Sets", count: 2 },
    { id: "acoustic", label: "Acoustic", count: 2 },
    { id: "interview", label: "Interviews", count: 1 },
  ] as const

  const streams = [
    {
      id: 1,
      title: "Midnight Echoes – Premiere",
      artist: "Luna Waves",
      category: "premiere",
      image: "/placeholder.svg?height=300&width=300&text=Midnight+Echoes",
      viewers: 847,
      duration: "45:23",
      genre: "Electronic",
      verified: true,
      startedAt: "15 min ago",
      status: "live" as const,
      features: ["Chat", "Tips", "NFT Drop"],
      humanVerified: true,
    },
    {
      id: 2,
      title: "Bass Revolution DJ Set",
      artist: "Deep Frequency",
      category: "dj-set",
      image: "/placeholder.svg?height=300&width=300&text=Bass+Revolution",
      viewers: 1203,
      duration: "1:15:30",
      genre: "Dubstep",
      verified: true,
      startedAt: "32 min ago",
      status: "live" as const,
      features: ["Chat", "Tips"],
      humanVerified: true,
    },
    {
      id: 3,
      title: "Electronic Fusion Experience",
      artist: "Stellar Beats",
      category: "premiere",
      image: "/placeholder.svg?height=300&width=300&text=Electronic+Fusion",
      viewers: 0,
      duration: null,
      genre: "Electronic",
      verified: true,
      startedAt: null,
      status: "scheduled" as const,
      scheduledFor: "In 2 hours",
      features: ["Chat", "Tips", "Album NFT"],
      humanVerified: true,
    },
  ]

  const filtered = streams.filter((s) => {
    const matchCat = selectedCategory === "all" || s.category === selectedCategory
    const q = searchQuery.toLowerCase()
    const matchTxt = s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    return matchCat && matchTxt
  })

  const liveCount = filtered.filter((s) => s.status === "live").length

  useEffect(() => {
    const t = setTimeout(() => {
      filtered.forEach((_, idx) => setTimeout(() => setCardInView((prev) => [...prev, idx]), idx * 120))
    }, 80)
    return () => clearTimeout(t)
  }, [selectedCategory, searchQuery, filtered])

  const rarityColor = (status: string) => (status === "live" ? "bg-red-500" : "bg-amply-orange")

  return (
    <div className="min-h-screen bg-amply-cream pb-24 md:pb-0">
      {/* Verification Gate Overlay */}
      {!isVerified && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="bg-gray-900 border-gray-800 shadow-2xl rounded-3xl max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Verification Required</h2>
              <p className="text-gray-400 mb-6">
                To access live streams on Amply, we need to verify you&apos;re a real human. This ensures authentic engagement and protects our artists from bots.
              </p>
              <Button 
                onClick={() => verifyHuman('live-page-access')}
                disabled={verificationLoading}
                className="amply-button-primary px-8 py-3 rounded-2xl w-full mb-4"
              >
                <Shield className="w-5 h-5 mr-2" />
                {verificationLoading ? 'Verifying...' : 'Verify with World ID'}
              </Button>
              <Link href="/">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
      
      <header className="sticky top-0 z-50 bg-amply-white/95 backdrop-blur-md border-b border-gray-100 shadow-soft">
        <div className="mobile-padding mobile-padding-y">
          <div className="flex items-center justify-between mb-4 sm:mb-0">
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

            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link href="/feed" className="text-gray-600 hover:text-amply-orange transition-colors font-medium">
                Explore
              </Link>
              <Link href="/live" className="text-amply-orange font-semibold">
                Live
              </Link>
              <Link href="/artist" className="text-gray-600 hover:text-amply-orange transition-colors font-medium">
                For Artists
              </Link>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Badge className="animate-soft-pulse flex items-center space-x-1 sm:space-x-2 bg-red-500/20 text-red-600 border-0 px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm">
                <Radio className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{liveCount} LIVE</span>
              </Badge>
              <WorldIdBadge size="sm" className="hidden sm:flex" />
              <Link href="/profile">
                <Button className="amply-button-primary px-3 sm:px-6 py-2 rounded-2xl text-sm sm:text-base touch-target">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sm:hidden">Me</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                placeholder="Search live streams, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 bg-gray-50 border-0 rounded-2xl py-2 sm:py-3 text-sm sm:text-base touch-target"
              />
            </div>
            <Button className="amply-button-outline px-4 sm:px-6 py-2 sm:py-3 rounded-2xl text-sm sm:text-base touch-target">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <section className="mobile-padding py-6 sm:py-8">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {categories.map((c) => (
            <Button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.id)
                setCardInView([])
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl transition-all whitespace-nowrap flex-shrink-0 touch-target text-sm sm:text-base ${
                selectedCategory === c.id ? "amply-button-primary" : "amply-button-outline"
              }`}
            >
              {c.label}
              <Badge className="ml-2 bg-amply-pink/20 text-amply-pink border-0 text-xs px-2 py-0.5 sm:py-1 rounded-full">
                {c.count}
              </Badge>
            </Button>
          ))}
        </div>
      </section>

      <main className="mobile-padding grid-mobile-responsive pb-20 sm:pb-24">
        {filtered.map((s, idx) => (
          <div
            key={s.id}
            className={`transition-all duration-500 ${
              cardInView.includes(idx) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-amply-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover cursor-pointer group transition-all">
              <div className="relative aspect-video">
                <img src={s.image || "/placeholder.svg"} alt={s.title} className="object-cover w-full h-full" />

                <Badge
                  className={`absolute top-3 sm:top-4 left-3 sm:left-4 ${rarityColor(s.status)} text-white flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl shadow-soft text-xs sm:text-sm`}
                >
                  {s.status === "live" ? (
                    <Radio className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  <span className="uppercase font-semibold">{s.status === "live" ? "LIVE" : "SCHEDULED"}</span>
                </Badge>

                {s.status === "live" && (
                  <Badge className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-amply-black/70 text-white flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{s.viewers?.toLocaleString()}</span>
                  </Badge>
                )}

                <div className="absolute inset-0 bg-amply-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button
                    className="amply-button-primary px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-lg rounded-2xl touch-target"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/live/${s.id}`)
                    }}
                  >
                    {s.status === "live" ? "Join Stream" : "Set Reminder"}
                  </Button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-amply-black line-clamp-1 flex-1 min-w-0 mr-2">
                    {s.title}
                  </h3>
                  {s.verified && (
                    <Star
                      className="w-4 h-4 sm:w-5 sm:h-5 text-amply-orange flex-shrink-0"
                      aria-label="Verified artist"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-2 flex-wrap">
                  <p className="text-gray-600 font-medium text-sm sm:text-base">{s.artist}</p>
                  {s.humanVerified && <WorldIdBadge size="sm" className="flex-shrink-0" />}
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                  {s.status === "live" ? (
                    <>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {s.startedAt}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {s.viewers?.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {s.scheduledFor}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {s.features.slice(0, 3).map((f) => (
                    <Badge
                      key={f}
                      className="bg-gray-50 text-gray-600 border-0 text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
                    >
                      {f === "Tips" && <Zap className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />}
                      {f === "NFT Drop" && <Gift className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />}
                      {f}
                    </Badge>
                  ))}
                </div>

                <Button
                  className={`w-full py-2 sm:py-3 rounded-2xl touch-target text-sm sm:text-base ${
                    s.status === "live" ? "bg-red-500 hover:bg-red-600 text-white" : "amply-button-secondary"
                  }`}
                  onClick={() => router.push(`/live/${s.id}`)}
                >
                  {s.status === "live" ? "Join Live Stream" : "Set Reminder"}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 sm:py-20">
            <Radio className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-2xl sm:text-3xl font-bold text-amply-black mb-2 sm:mb-4">No Results Found</h3>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Try changing your search or category filter.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
              className="amply-button-primary px-6 sm:px-8 py-3 sm:py-4 rounded-2xl touch-target"
            >
              View All Live Streams
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}