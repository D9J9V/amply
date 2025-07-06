'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Music, Upload, Lock, Unlock, AlertCircle, CheckCircle } from 'lucide-react';
import { walrusStorage } from '@/lib/services/walrus-storage';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export default function UploadSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
  });
  const [contentInfo, setContentInfo] = useState({
    title: '',
    description: '',
    genre: '',
    isPrivate: false,
    supporterOnly: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadState({ isUploading: false, progress: 0, error: null, success: false });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !contentInfo.title) {
      setUploadState(prev => ({ ...prev, error: 'Please select a file and enter a title' }));
      return;
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      success: false,
    });

    try {
      // Simulate progress for demo
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 200);

      // Get demo artist ID (in production, get from auth)
      const artistId = 'demo-artist-id';

      // Extract duration if audio file
      let duration = 0;
      if (selectedFile.type.startsWith('audio/')) {
        const audio = new Audio();
        audio.src = URL.createObjectURL(selectedFile);
        await new Promise<void>((resolve) => {
          audio.addEventListener('loadedmetadata', () => {
            duration = Math.round(audio.duration);
            URL.revokeObjectURL(audio.src);
            resolve();
          });
        });
      }

      const result = await walrusStorage.uploadContent(selectedFile, artistId, {
        title: contentInfo.title,
        description: contentInfo.description,
        contentType: 'track',
        isPrivate: contentInfo.isPrivate,
        metadata: {
          duration,
          artist: 'Demo Artist', // In production, get from auth
          genre: contentInfo.genre,
          worldIdVerified: true,
        },
      });

      clearInterval(progressInterval);

      if (result) {
        setUploadState({
          isUploading: false,
          progress: 100,
          error: null,
          success: true,
        });

        // Reset form after successful upload
        setTimeout(() => {
          setSelectedFile(null);
          setContentInfo({
            title: '',
            description: '',
            genre: '',
            isPrivate: false,
            supporterOnly: false,
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setUploadState({ isUploading: false, progress: 0, error: null, success: false });
        }, 3000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed',
        success: false,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upload Music with Walrus */}
      <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center text-amply-black">
            <Music className="w-5 h-5 mr-2" />
            Upload Music to Walrus
          </CardTitle>
          <CardDescription>
            Store your music permanently on the decentralized Walrus network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
            {selectedFile ? (
              <div className="space-y-2">
                <Music className="w-12 h-12 text-amply-orange mx-auto" />
                <p className="font-medium text-amply-black">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  className="amply-button-outline mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop your audio file here</p>
                <p className="text-sm text-gray-500">MP3, WAV, FLAC up to 100MB</p>
                <Button
                  className="amply-button-outline mt-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Track Info */}
          <div className="space-y-4">
            <Input
              placeholder="Track Title"
              value={contentInfo.title}
              onChange={(e) => setContentInfo(prev => ({ ...prev, title: e.target.value }))}
              className="rounded-2xl"
              disabled={uploadState.isUploading}
            />
            <Textarea
              placeholder="Description"
              value={contentInfo.description}
              onChange={(e) => setContentInfo(prev => ({ ...prev, description: e.target.value }))}
              className="rounded-2xl"
              disabled={uploadState.isUploading}
            />
            <Input
              placeholder="Genre"
              value={contentInfo.genre}
              onChange={(e) => setContentInfo(prev => ({ ...prev, genre: e.target.value }))}
              className="rounded-2xl"
              disabled={uploadState.isUploading}
            />
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center justify-between">
              <Label htmlFor="private-content" className="flex items-center cursor-pointer">
                {contentInfo.isPrivate ? (
                  <Lock className="w-4 h-4 mr-2 text-amply-orange" />
                ) : (
                  <Unlock className="w-4 h-4 mr-2 text-gray-400" />
                )}
                <span className="font-medium">Private Content</span>
              </Label>
              <Switch
                id="private-content"
                checked={contentInfo.isPrivate}
                onCheckedChange={(checked) => setContentInfo(prev => ({ ...prev, isPrivate: checked }))}
                disabled={uploadState.isUploading}
              />
            </div>
            {contentInfo.isPrivate && (
              <p className="text-sm text-gray-600 ml-6">
                Only your supporters can access this content
              </p>
            )}
          </div>

          {/* Upload Progress */}
          {uploadState.isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uploading to Walrus...</span>
                <span className="text-amply-orange font-medium">{uploadState.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-amply-gradient h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadState.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{uploadState.error}</p>
            </div>
          )}

          {/* Success Message */}
          {uploadState.success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-700 font-medium">Upload successful!</p>
                <p className="text-sm text-green-600 mt-1">
                  Your track is now permanently stored on Walrus.
                </p>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <Button
            className="amply-button-primary w-full py-3 rounded-2xl"
            onClick={handleUpload}
            disabled={!selectedFile || !contentInfo.title || uploadState.isUploading}
          >
            {uploadState.isUploading ? 'Uploading...' : 'Upload to Walrus'}
          </Button>
        </CardContent>
      </Card>

      {/* Private Vault Info */}
      <Card className="bg-amply-white border-0 shadow-card rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center text-amply-black">
            <Lock className="w-5 h-5 mr-2" />
            Your Private Vault
          </CardTitle>
          <CardDescription>
            Exclusive content for your supporters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-amply-orange/10 to-amply-pink/10 rounded-2xl">
            <h3 className="font-semibold text-amply-black mb-3">How Private Vaults Work</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-amply-orange mr-2">•</span>
                Upload exclusive content that only your supporters can access
              </li>
              <li className="flex items-start">
                <span className="text-amply-orange mr-2">•</span>
                Content is encrypted and stored on the decentralized Walrus network
              </li>
              <li className="flex items-start">
                <span className="text-amply-orange mr-2">•</span>
                Supporters with verified World ID get access to your vault
              </li>
              <li className="flex items-start">
                <span className="text-amply-orange mr-2">•</span>
                Set different tiers for different levels of exclusive content
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Vault Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Total Supporters: 156</p>
                <p>Private Tracks: 12</p>
                <p>Revenue This Month: $2,340</p>
              </div>
            </div>

            <Button className="amply-button-secondary w-full py-3 rounded-2xl">
              <Lock className="w-4 h-4 mr-2" />
              Manage Vault Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}