"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useWorldId } from "@/contexts/world-id-context"
import {
  Users,
  Settings,
  Edit3,
  Camera,
  Music,
  Zap,
  Play,
  Heart,
  Share2,
  Globe,
  Wallet,
  Shield,
  Bell,
  Upload,
  TrendingUp,
  Calendar,
  Clock,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import WorldIdBadge from "@/components/world-id-badge"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { walletAddress, authenticateWallet, verificationLoading, isVerified } = useWorldId()
  const [profileData, setProfileData] = useState({
    name: "Alex Rivera",
    username: "@alexrivera",
    bio: "Creating authentic music for the digital age 🎵 Verified human artist sharing real vibes with real people.",
    location: "Los Angeles, CA",
    website: "alexrivera.music",
    joinedDate: "March 2024",
  })

  const [settings, setSettings] = useState({
    publicProfile: true,
    showActivity: true,
    emailNotifications: true,
    pushNotifications: false,
    autoPlay: true,
  })

  const stats = [
    { label: "Followers", value: "2.4K", icon: Users, color: "text-amply-orange" },
    { label: "Following", value: "156", icon: Users, color: "text-amply-pink" },
    { label: "Total Plays", value: "45.2K", icon: Play, color: "text-green-600" },
  ]

  const userContent = {
    music: [
      {
        id: 1,
        title: "Summer Vibes",
        plays: 15420,
        likes: 892,
        image: "/placeholder.svg?height=300&width=300&text=Summer+Vibes",
        uploadedAt: "2 weeks ago",
        duration: "3:24",
      },
      {
        id: 2,
        title: "Midnight Dreams",
        plays: 8934,
        likes: 567,
        image: "/placeholder.svg?height=300&width=300&text=Midnight+Dreams",
        uploadedAt: "1 month ago",
        duration: "4:12",
      },
    ],
    drops: [
      {
        id: 3,
        title: "Exclusive Acoustic Set",
        price: "0.05 WLD",
        sold: 23,
        total: 50,
        image: "/placeholder.svg?height=300&width=300&text=Acoustic+Set",
        createdAt: "1 week ago",
        rarity: "Rare",
      },
    ],
    activity: [
      { id: 1, type: "liked", content: "Neon Nights by Maya Chen", time: "2 hours ago" },
      { id: 2, type: "followed", content: "Luna Waves", time: "1 day ago" },
      { id: 3, type: "purchased", content: "Urban Symphony NFT", time: "3 days ago" },
      { id: 4, type: "uploaded", content: "Summer Vibes", time: "2 weeks ago" },
    ],
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Save profile data
  }

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-amply-cream pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-amply-white/95 backdrop-blur-md border-b border-gray-100 shadow-soft">
        <div className="mobile-padding mobile-padding-y">
          <div className="flex items-center justify-between">
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
              <Link href="/live" className="text-gray-600 hover:text-amply-orange transition-colors font-medium">
                Live
              </Link>
              <Link href="/profile" className="text-amply-orange font-semibold">
                Profile
              </Link>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {isVerified && <WorldIdBadge size="sm" className="hidden sm:flex" />}
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="amply-button-outline px-3 sm:px-6 py-2 rounded-2xl text-sm sm:text-base touch-target"
              >
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{isEditing ? "Cancel" : "Edit"}</span>
                <span className="sm:hidden">{isEditing ? "✕" : "✎"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mobile-padding mobile-padding-y">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Profile Header */}
          <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col items-center space-y-4 sm:space-y-6 md:flex-row md:items-start md:space-y-0 md:space-x-6 lg:space-x-8">
                {/* Profile Picture */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-amply-gradient-soft rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-card">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-amply-orange hover:bg-amply-orange/90 text-white rounded-xl sm:rounded-2xl p-0 touch-target"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left space-y-3 sm:space-y-4 w-full min-w-0">
                  {isEditing ? (
                    <div className="space-y-3 sm:space-y-4">
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                        className="text-xl sm:text-2xl font-bold rounded-2xl touch-target"
                        placeholder="Your name"
                      />
                      <Input
                        value={profileData.username}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, username: e.target.value }))}
                        className="text-gray-600 rounded-2xl touch-target"
                        placeholder="@username"
                      />
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                        className="rounded-2xl touch-target"
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <Input
                          value={profileData.location}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                          className="rounded-2xl touch-target"
                          placeholder="Location"
                        />
                        <Input
                          value={profileData.website}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, website: e.target.value }))}
                          className="rounded-2xl touch-target"
                          placeholder="Website"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-center md:justify-start space-x-2 sm:space-x-3 mb-2 flex-wrap">
                          <h1 className="text-2xl sm:text-3xl font-bold text-amply-black">{profileData.name}</h1>
                          {isVerified && <WorldIdBadge size="md" className="flex-shrink-0" />}
                        </div>
                        <p className="text-gray-600 text-base sm:text-lg">{profileData.username}</p>
                      </div>
                      <p className="text-gray-700 leading-relaxed max-w-2xl text-sm sm:text-base">{profileData.bio}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 text-gray-600 text-sm sm:text-base">
                        <span className="flex items-center">
                          <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {profileData.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Joined {profileData.joinedDate}
                        </span>
                      </div>
                    </>
                  )}

                  {isEditing ? (
                    <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
                      <Button
                        onClick={handleSaveProfile}
                        className="amply-button-primary px-6 sm:px-8 py-2 rounded-2xl touch-target"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        className="amply-button-outline px-6 sm:px-8 py-2 rounded-2xl touch-target"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
                      <Button className="amply-button-primary px-6 sm:px-8 py-2 rounded-2xl touch-target">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Follow
                      </Button>
                      <Button className="amply-button-outline px-6 sm:px-8 py-2 rounded-2xl touch-target">
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-amply-white border-0 shadow-card rounded-3xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-xl sm:text-2xl font-bold text-amply-black mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-2 sm:p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="music" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-50 rounded-2xl sm:rounded-3xl p-2 gap-1 sm:gap-0">
              <TabsTrigger value="music" className="rounded-xl sm:rounded-2xl py-2 sm:py-3 text-xs sm:text-sm">
                <Music className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Music
              </TabsTrigger>
              <TabsTrigger value="drops" className="rounded-xl sm:rounded-2xl py-2 sm:py-3 text-xs sm:text-sm">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Drops
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="rounded-xl sm:rounded-2xl py-2 sm:py-3 text-xs sm:text-sm col-span-1 sm:col-span-1"
              >
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Activity</span>
                <span className="sm:hidden">Feed</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-xl sm:rounded-2xl py-2 sm:py-3 text-xs sm:text-sm col-span-1 sm:col-span-1"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">⚙️</span>
              </TabsTrigger>
            </TabsList>

            {/* Music Tab */}
            <TabsContent value="music" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-amply-black">Your Music</h2>
                <Link href="/create/music">
                  <Button className="amply-button-primary px-6 py-2 rounded-2xl">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Music
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userContent.music.map((track) => (
                  <Card key={track.id} className="bg-amply-white border-0 shadow-card rounded-3xl overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={track.image || "/placeholder.svg"}
                        alt={track.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button className="w-16 h-16 bg-amply-white/20 hover:bg-amply-white/30 text-white border-0 rounded-full backdrop-blur-md">
                          <Play className="w-6 h-6 ml-1" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-amply-black">{track.title}</h3>
                        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600 p-2">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <Play className="w-4 h-4 mr-1" />
                          {track.plays.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {track.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {track.duration}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">Uploaded {track.uploadedAt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Drops Tab */}
            <TabsContent value="drops" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-amply-black">Your NFT Drops</h2>
                <Link href="/create/drop">
                  <Button className="amply-button-secondary px-6 py-2 rounded-2xl">
                    <Zap className="w-4 h-4 mr-2" />
                    Create Drop
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userContent.drops.map((drop) => (
                  <Card key={drop.id} className="bg-amply-white border-0 shadow-card rounded-3xl overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={drop.image || "/placeholder.svg"}
                        alt={drop.title}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-4 left-4 bg-amply-pink text-white px-3 py-1 rounded-2xl">
                        <Zap className="w-3 h-3 mr-1" />
                        NFT
                      </Badge>
                      <Badge className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-2xl">
                        {drop.rarity}
                      </Badge>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-bold text-amply-black">{drop.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-amply-pink">{drop.price}</span>
                        <span className="text-gray-600">
                          {drop.sold}/{drop.total} sold
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">Created {drop.createdAt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <h2 className="text-2xl font-bold text-amply-black">Recent Activity</h2>

              <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {userContent.activity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                        <div className="w-10 h-10 bg-amply-gradient-soft rounded-2xl flex items-center justify-center">
                          {activity.type === "liked" && <Heart className="w-5 h-5 text-white" />}
                          {activity.type === "followed" && <Users className="w-5 h-5 text-white" />}
                          {activity.type === "purchased" && <Zap className="w-5 h-5 text-white" />}
                          {activity.type === "uploaded" && <Upload className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-amply-black">
                            You {activity.type} <span className="font-semibold">{activity.content}</span>
                          </p>
                          <p className="text-gray-500 text-sm">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-bold text-amply-black">Account Settings</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Privacy Settings */}
                <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amply-black">
                      <Shield className="w-5 h-5 mr-2" />
                      Privacy
                    </CardTitle>
                    <CardDescription>Control who can see your content and activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-medium text-amply-black">Public Profile</p>
                        <p className="text-sm text-gray-600">Allow others to find and view your profile</p>
                      </div>
                      <Switch
                        checked={settings.publicProfile}
                        onCheckedChange={(value) => handleSettingChange("publicProfile", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-medium text-amply-black">Show Activity</p>
                        <p className="text-sm text-gray-600">Display your listening activity to followers</p>
                      </div>
                      <Switch
                        checked={settings.showActivity}
                        onCheckedChange={(value) => handleSettingChange("showActivity", value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amply-black">
                      <Bell className="w-5 h-5 mr-2" />
                      Notifications
                    </CardTitle>
                    <CardDescription>Manage how you receive updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-medium text-amply-black">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(value) => handleSettingChange("emailNotifications", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-medium text-amply-black">Push Notifications</p>
                        <p className="text-sm text-gray-600">Get notified on your device</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(value) => handleSettingChange("pushNotifications", value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Wallet Settings */}
                <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amply-black">
                      <Wallet className="w-5 h-5 mr-2" />
                      Wallet & Payments
                    </CardTitle>
                    <CardDescription>Manage your wallet and payment methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {walletAddress ? (
                      <>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-amply-black">World ID Wallet</p>
                            <Badge className="bg-green-100 text-green-700">Connected</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Session expires in 7 days
                          </p>
                        </div>

                        <Button className="w-full amply-button-outline py-3 rounded-2xl">
                          <Wallet className="w-4 h-4 mr-2" />
                          Disconnect Wallet
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-amply-black">World ID Wallet</p>
                            <Badge className="bg-gray-100 text-gray-600">Not Connected</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Connect your World wallet to manage payments and tips
                          </p>
                        </div>

                        <Button 
                          onClick={authenticateWallet}
                          disabled={verificationLoading}
                          className="w-full amply-button-primary py-3 rounded-2xl"
                        >
                          <Wallet className="w-4 h-4 mr-2" />
                          {verificationLoading ? 'Connecting...' : 'Connect Wallet'}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Playback Settings */}
                <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amply-black">
                      <Play className="w-5 h-5 mr-2" />
                      Playback
                    </CardTitle>
                    <CardDescription>Control your music playback experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-medium text-amply-black">Auto-play</p>
                        <p className="text-sm text-gray-600">Automatically play similar music</p>
                      </div>
                      <Switch
                        checked={settings.autoPlay}
                        onCheckedChange={(value) => handleSettingChange("autoPlay", value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}