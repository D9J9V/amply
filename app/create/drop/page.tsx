"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Zap, ImageIcon, Music, Users, Gift, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import WorldIdBadge from "@/components/world-id-badge"

export default function CreateDropPage() {
  const [isLimitedEdition, setIsLimitedEdition] = useState(true)
  const [includePhysical, setIncludePhysical] = useState(false)
  const [enableAuction, setEnableAuction] = useState(false)

  return (
    <div className="min-h-screen bg-amply-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-amply-white/95 backdrop-blur-md border-b border-gray-100 shadow-soft">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/artist" className="p-2 hover:bg-gray-100 rounded-2xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
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
          </div>

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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amply-black mb-4">Create NFT Drop</h1>
            <p className="text-xl text-gray-600">
              Launch exclusive content and connect with your biggest fans through limited edition drops.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Drop Configuration */}
            <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center text-amply-black">
                  <Zap className="w-5 h-5 mr-2" />
                  Drop Details
                </CardTitle>
                <CardDescription>Configure your exclusive NFT drop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-amply-black mb-2 block">Drop Title</label>
                    <Input placeholder="Enter your drop title" className="rounded-2xl" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-amply-black mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe what makes this drop special..."
                      className="rounded-2xl min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-amply-black mb-2 block">Price (WLD)</label>
                      <Input placeholder="0.05" type="number" step="0.01" className="rounded-2xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amply-black mb-2 block">Rarity</label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white">
                        <option>Common</option>
                        <option>Rare</option>
                        <option>Epic</option>
                        <option>Legendary</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Content Upload */}
                <div className="space-y-4">
                  <h4 className="font-medium text-amply-black">Drop Content</h4>

                  {/* Artwork Upload */}
                  <div>
                    <label className="text-sm font-medium text-amply-black mb-2 block">Artwork</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm mb-2">Upload NFT artwork</p>
                      <p className="text-xs text-gray-500">JPG, PNG, GIF up to 50MB</p>
                      <Button size="sm" className="amply-button-outline mt-3">
                        Choose Image
                      </Button>
                    </div>
                  </div>

                  {/* Music Upload */}
                  <div>
                    <label className="text-sm font-medium text-amply-black mb-2 block">Exclusive Track</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
                      <Music className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm mb-2">Upload exclusive music</p>
                      <p className="text-xs text-gray-500">MP3, WAV, FLAC up to 100MB</p>
                      <Button size="sm" className="amply-button-outline mt-3">
                        Choose Audio
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Drop Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-amply-black">Drop Settings</h4>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="font-medium text-amply-black">Limited Edition</p>
                      <p className="text-sm text-gray-600">Restrict the number of copies</p>
                    </div>
                    <Switch checked={isLimitedEdition} onCheckedChange={setIsLimitedEdition} />
                  </div>

                  {isLimitedEdition && (
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <label className="text-sm font-medium text-amply-black mb-2 block">Edition Size</label>
                      <Input placeholder="100" type="number" className="rounded-2xl" />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="font-medium text-amply-black">Include Physical Item</p>
                      <p className="text-sm text-gray-600">Add signed vinyl, poster, etc.</p>
                    </div>
                    <Switch checked={includePhysical} onCheckedChange={setIncludePhysical} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="font-medium text-amply-black">Auction Mode</p>
                      <p className="text-sm text-gray-600">Let fans bid on the drop</p>
                    </div>
                    <Switch checked={enableAuction} onCheckedChange={setEnableAuction} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview & Benefits */}
            <div className="space-y-6">
              {/* Drop Preview */}
              <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-amply-black">Drop Preview</CardTitle>
                  <CardDescription>How your drop will appear to fans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="aspect-square bg-amply-gradient-soft rounded-2xl flex items-center justify-center mb-4">
                      <ImageIcon className="w-16 h-16 text-white opacity-50" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-amply-pink/20 text-amply-pink border-0">
                          <Zap className="w-3 h-3 mr-1" />
                          NFT Drop
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-700">Rare</Badge>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-amply-black">Your Drop Title</h4>
                          <WorldIdBadge size="sm" />
                        </div>
                        <p className="text-gray-600 text-sm">Your Artist Name</p>
                      </div>

                      <p className="text-gray-600 text-sm">Your drop description will appear here...</p>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-amply-orange">0.05 WLD</span>
                        <span className="text-sm text-gray-500">100 available</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-amply-black">Drop Benefits</CardTitle>
                  <CardDescription>What collectors will receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-amply-orange/20 rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-amply-orange" />
                    </div>
                    <span className="text-amply-black font-medium">Exclusive NFT Artwork</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-amply-pink/20 rounded-xl flex items-center justify-center">
                      <Music className="w-4 h-4 text-amply-pink" />
                    </div>
                    <span className="text-amply-black font-medium">High-Quality Audio Download</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-amply-black font-medium">Exclusive Community Access</span>
                  </div>

                  {includePhysical && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                      <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                        <Gift className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-amply-black font-medium">Physical Collectible</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Launch Settings */}
              <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-amply-black">Launch Settings</CardTitle>
                  <CardDescription>When to make your drop available</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-amply-orange" />
                      <div>
                        <p className="font-medium text-amply-black">Launch Now</p>
                        <p className="text-sm text-gray-600">Make drop available immediately</p>
                      </div>
                    </div>
                    <input type="radio" name="launch" defaultChecked className="text-amply-orange" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-amply-black">Schedule Launch</p>
                        <p className="text-sm text-gray-600">Set a specific date and time</p>
                      </div>
                    </div>
                    <input type="radio" name="launch" className="text-amply-orange" />
                  </div>

                  <Button className="amply-button-secondary w-full py-3 rounded-2xl">
                    <Zap className="w-4 h-4 mr-2" />
                    Create Drop
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}