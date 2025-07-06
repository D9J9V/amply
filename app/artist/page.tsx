"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, Upload, Zap, Users, TrendingUp, DollarSign, Play, Heart, Globe, CheckCircle } from "lucide-react"
import Link from "next/link"
import WorldIdBadge from "@/components/world-id-badge"
import UploadSection from "./upload-section"
import { useWorldId } from "@/contexts/world-id-context"

export default function ArtistPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { isArtistVerified, verifyArtist, verificationLoading } = useWorldId()
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)

  // Check if artist needs verification
  useEffect(() => {
    if (!isArtistVerified) {
      setShowVerificationPrompt(true)
    }
  }, [isArtistVerified])

  const handleArtistVerification = async () => {
    try {
      const result = await verifyArtist('artist-dashboard-access')
      if (result?.status === 'success') {
        setShowVerificationPrompt(false)
      }
    } catch (error) {
      console.error('Artist verification error:', error)
    }
  }

  const stats = [
    { label: "Total Streams", value: "2.4M", icon: Play, color: "text-amply-orange" },
    { label: "Monthly Listeners", value: "156K", icon: Users, color: "text-amply-pink" },
    { label: "Total Revenue", value: "$12.8K", icon: DollarSign, color: "text-green-600" },
    { label: "NFT Sales", value: "89", icon: Zap, color: "text-purple-600" },
  ]

  const recentTracks = [
    {
      id: 1,
      title: "Summer Vibes",
      plays: 45200,
      likes: 1240,
      revenue: "$340",
      uploadDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Midnight Dreams",
      plays: 32100,
      likes: 890,
      revenue: "$280",
      uploadDate: "2024-01-10",
    },
    {
      id: 3,
      title: "Electric Pulse",
      plays: 28900,
      likes: 756,
      revenue: "$245",
      uploadDate: "2024-01-05",
    },
  ]

  return (
    <div className="min-h-screen bg-amply-cream">
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

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/feed" className="text-gray-600 hover:text-amply-orange transition-colors font-medium">
              Explore
            </Link>
            <Link href="/live" className="text-gray-600 hover:text-amply-orange transition-colors font-medium">
              Live
            </Link>
            <Link href="/artist" className="text-amply-orange font-semibold">
              For Artists
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
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Artist Verification Prompt */}
        {showVerificationPrompt && !isArtistVerified && (
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <Globe className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Artist Verification Required
                </h3>
                <p className="text-blue-700 mb-4">
                  Verify your humanity with World ID to access all artist features and upload content.
                </p>
                <Button
                  onClick={handleArtistVerification}
                  disabled={verificationLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl"
                >
                  {verificationLoading ? 'Verifying...' : 'Verify with World ID'}
                </Button>
              </div>
              {isArtistVerified && (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </div>
          </div>
        )}
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amply-orange to-amply-pink rounded-4xl p-8 md:p-12 text-white mb-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Amplify Your Music</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Join the future of music where authenticity meets innovation. Connect with real fans through World ID
              verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isArtistVerified ? (
                <>
                  <Link href="/create/music">
                    <Button className="bg-amply-white text-amply-orange hover:bg-gray-100 px-8 py-4 text-lg rounded-2xl font-semibold">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Music
                    </Button>
                  </Link>
                  <Link href="/create/drop">
                    <Button className="bg-amply-white/20 text-white border-2 border-white/30 hover:bg-amply-white/30 px-8 py-4 text-lg rounded-2xl font-semibold">
                      <Zap className="w-5 h-5 mr-2" />
                      Create NFT Drop
                    </Button>
                  </Link>
                </>
              ) : (
                <Button 
                  onClick={handleArtistVerification}
                  disabled={verificationLoading}
                  className="bg-amply-white text-amply-orange hover:bg-gray-100 px-8 py-4 text-lg rounded-2xl font-semibold"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  {verificationLoading ? 'Verifying...' : 'Verify to Upload'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-50 rounded-3xl p-2 mb-8">
            <TabsTrigger value="overview" className="rounded-2xl py-3">
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="upload" className="rounded-2xl py-3">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-2xl py-3">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="earnings" className="rounded-2xl py-3">
              <DollarSign className="w-4 h-4 mr-2" />
              Earnings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-amply-white border-0 shadow-card rounded-3xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-amply-black mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Tracks */}
            <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-amply-black">Recent Tracks</CardTitle>
                <CardDescription>Your latest uploads and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTracks.map((track) => (
                    <div key={track.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-amply-gradient-soft rounded-2xl flex items-center justify-center">
                          <Music className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-amply-black">{track.title}</h4>
                          <p className="text-gray-600 text-sm">Uploaded {track.uploadDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Play className="w-4 h-4 mr-1" />
                          {track.plays.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {track.likes.toLocaleString()}
                        </span>
                        <span className="font-semibold text-green-600">{track.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-8">
            <UploadSection />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
              <CardHeader>
                <CardTitle className="text-amply-black">Performance Analytics</CardTitle>
                <CardDescription>Track your music&apos;s performance and audience engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <p className="text-gray-500">Analytics charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-8">
            <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
              <CardHeader>
                <CardTitle className="text-amply-black">Earnings Overview</CardTitle>
                <CardDescription>Track your revenue from streams, tips, and NFT sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <p className="text-gray-500">Earnings breakdown will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}