"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, Music, ImageIcon, Check, Play, Pause, Volume2, Users, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"
import WorldIdBadge from "@/components/world-id-badge"

export default function CreateMusicPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

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
            <h1 className="text-4xl font-bold text-amply-black mb-4">Upload Your Music</h1>
            <p className="text-xl text-gray-600">
              Share your creativity with the world. Only verified humans can upload authentic music.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Form */}
            <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center text-amply-black">
                  <Music className="w-5 h-5 mr-2" />
                  Track Details
                </CardTitle>
                <CardDescription>Fill in the information about your track</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Audio Upload */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-amply-black">Audio File</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                    {uploadComplete ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-green-600 font-medium">Upload Complete!</p>
                        <div className="flex items-center justify-center space-x-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="rounded-2xl"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <div className="flex-1 max-w-xs">
                            <Progress value={isPlaying ? 45 : 0} className="h-2" />
                          </div>
                          <Volume2 className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ) : isUploading ? (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 text-amply-orange mx-auto animate-bounce" />
                        <p className="text-amply-orange font-medium">Uploading...</p>
                        <Progress value={uploadProgress} className="max-w-xs mx-auto" />
                        <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-gray-600 mb-2">Drag and drop your audio file here</p>
                          <p className="text-sm text-gray-500">MP3, WAV, FLAC up to 100MB</p>
                        </div>
                        <Button onClick={handleUpload} className="amply-button-outline">
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Track Information */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-amply-black mb-2 block">Track Title</label>
                    <Input placeholder="Enter track title" className="rounded-2xl" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-amply-black mb-2 block">Description</label>
                    <Textarea placeholder="Tell your fans about this track..." className="rounded-2xl min-h-[100px]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-amply-black mb-2 block">Genre</label>
                      <Input placeholder="e.g. Electronic" className="rounded-2xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amply-black mb-2 block">Mood</label>
                      <Input placeholder="e.g. Energetic" className="rounded-2xl" />
                    </div>
                  </div>
                </div>

                {/* Cover Art Upload */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-amply-black">Cover Art</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm mb-2">Upload cover art</p>
                    <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                    <Button size="sm" className="amply-button-outline mt-3">
                      Choose Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview & Settings */}
            <div className="space-y-6">
              {/* Preview Card */}
              <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-amply-black">Preview</CardTitle>
                  <CardDescription>How your track will appear to listeners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-amply-gradient-soft rounded-2xl flex items-center justify-center">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-amply-black">Your Track Title</h4>
                          <WorldIdBadge size="xs" />
                        </div>
                        <p className="text-gray-600">Your Artist Name</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Your track description will appear here...</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>0 plays</span>
                      <Badge className="bg-amply-orange/20 text-amply-orange border-0">Free</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Publishing Settings */}
              <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-amply-black">Publishing Settings</CardTitle>
                  <CardDescription>Choose how you want to share your music</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-amply-orange" />
                      <div>
                        <p className="font-medium text-amply-black">Public</p>
                        <p className="text-sm text-gray-600">Anyone can discover and play</p>
                      </div>
                    </div>
                    <input type="radio" name="visibility" defaultChecked className="text-amply-orange" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-amply-black">Followers Only</p>
                        <p className="text-sm text-gray-600">Only your followers can access</p>
                      </div>
                    </div>
                    <input type="radio" name="visibility" className="text-amply-orange" />
                  </div>

                  <div className="pt-4">
                    <Button className="amply-button-primary w-full py-3 rounded-2xl" disabled={!uploadComplete}>
                      {uploadComplete ? "Publish Track" : "Upload Audio First"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}