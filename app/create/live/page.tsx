"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Radio, Users, Settings, Camera, Mic, ArrowLeft, MessageCircle, Zap } from "lucide-react"
import Link from "next/link"
import WorldIdBadge from "@/components/world-id-badge"

export default function CreateLivePage() {
  const [isScheduled, setIsScheduled] = useState(false)
  const [enableChat, setEnableChat] = useState(true)
  const [enableTips, setEnableTips] = useState(true)

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
            <h1 className="text-4xl font-bold text-amply-black mb-4">Create Live Stream</h1>
            <p className="text-xl text-gray-600">
              Connect with your audience in real-time. Share your music live with verified humans.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stream Setup */}
            <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center text-amply-black">
                  <Radio className="w-5 h-5 mr-2" />
                  Stream Setup
                </CardTitle>
                <CardDescription>Configure your live stream settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-amply-black mb-2 block">Stream Title</label>
                    <Input placeholder="Enter your stream title" className="rounded-2xl" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-amply-black mb-2 block">Description</label>
                    <Textarea
                      placeholder="Tell your audience what to expect..."
                      className="rounded-2xl min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-amply-black mb-2 block">Category</label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-white">
                        <option>Acoustic Session</option>
                        <option>DJ Set</option>
                        <option>Concert</option>
                        <option>Interview</option>
                        <option>Behind the Scenes</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amply-black mb-2 block">Genre</label>
                      <Input placeholder="e.g. Electronic" className="rounded-2xl" />
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-amply-black">Schedule Stream</label>
                      <p className="text-xs text-gray-600">Stream later instead of going live now</p>
                    </div>
                    <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
                  </div>

                  {isScheduled && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <label className="text-sm font-medium text-amply-black mb-2 block">Date</label>
                        <Input type="date" className="rounded-2xl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-amply-black mb-2 block">Time</label>
                        <Input type="time" className="rounded-2xl" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Stream Features */}
                <div className="space-y-4">
                  <h4 className="font-medium text-amply-black">Stream Features</h4>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-amply-orange" />
                      <div>
                        <p className="font-medium text-amply-black">Live Chat</p>
                        <p className="text-sm text-gray-600">Allow viewers to chat</p>
                      </div>
                    </div>
                    <Switch checked={enableChat} onCheckedChange={setEnableChat} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-amply-pink" />
                      <div>
                        <p className="font-medium text-amply-black">Tips & Donations</p>
                        <p className="text-sm text-gray-600">Receive tips from viewers</p>
                      </div>
                    </div>
                    <Switch checked={enableTips} onCheckedChange={setEnableTips} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Setup & Preview */}
            <div className="space-y-6">
              {/* Technical Setup */}
              <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-amply-black">
                    <Settings className="w-5 h-5 mr-2" />
                    Technical Setup
                  </CardTitle>
                  <CardDescription>Configure your audio and video settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Camera className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-amply-black">Camera</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Mic className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-amply-black">Microphone</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  </div>

                  <Button className="amply-button-outline w-full py-3 rounded-2xl">
                    <Settings className="w-4 h-4 mr-2" />
                    Test Audio & Video
                  </Button>
                </CardContent>
              </Card>

              {/* Stream Preview */}
              <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-amply-black">Stream Preview</CardTitle>
                  <CardDescription>How your stream will appear to viewers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center mb-4">
                    <div className="text-center text-white">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Camera preview will appear here</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amply-gradient-soft rounded-2xl flex items-center justify-center">
                        <Radio className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-amply-black">Your Stream Title</h4>
                          <WorldIdBadge size="xs" />
                        </div>
                        <p className="text-gray-600 text-sm">Your Artist Name</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <Badge className="bg-red-500 text-white">
                        <Radio className="w-3 h-3 mr-1" />
                        LIVE
                      </Badge>
                      <span className="text-gray-600">0 viewers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Go Live Button */}
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-lg font-semibold rounded-2xl">
                <Radio className="w-5 h-5 mr-2" />
                {isScheduled ? "Schedule Stream" : "Go Live Now"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}