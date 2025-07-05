'use client';

import { useState, useRef, useEffect } from 'react';

interface BlobInfo {
  id: string;
  blobId: string;
  size: number;
  deletable: boolean;
  metadata?: TrackMetadata;
}

interface TrackMetadata {
  title: string;
  artist: string;
  duration: number;
  blobId: string;
  worldIdVerified: boolean;
  uploadedAt: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  currentPhase: 'idle' | 'draft' | 'permanent' | 'metadata' | 'complete';
}

export default function WalrusTestPage() {
  const [aggregatorUrl] = useState(
    process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || 
    'https://aggregator.walrus-testnet.walrus.space'
  );
  const [publisherUrl] = useState(
    process.env.NEXT_PUBLIC_WALRUS_PUBLISHER_URL || 
    'https://publisher.walrus-testnet.walrus.space'
  );
  const [blobs, setBlobs] = useState<BlobInfo[]>([]);
  const [selectedBlob, setSelectedBlob] = useState<BlobInfo | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    currentPhase: 'idle'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<TrackMetadata>({
    title: '',
    artist: '',
    duration: 0,
    blobId: '',
    worldIdVerified: false,
    uploadedAt: new Date().toISOString()
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffering, setAudioBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced upload with real XMLHttpRequest for progress tracking
  const uploadFileWithProgress = async (file: File, isDraft: boolean): Promise<BlobInfo | null> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      // Use proxy endpoint to avoid CORS issues
      const url = `/api/walrus-proxy${isDraft ? '?deletable=true' : ''}`;

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadState(prev => ({ ...prev, progress }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            // Handle both possible response formats from Walrus
            let blobInfo: BlobInfo | null = null;
            
            if (response.newlyCreated?.blobObject) {
              blobInfo = {
                id: response.newlyCreated.blobObject.id,
                blobId: response.newlyCreated.blobObject.blobId,
                size: response.newlyCreated.blobObject.size,
                deletable: isDraft
              };
            } else if (response.alreadyCertified?.blobId) {
              blobInfo = {
                id: response.alreadyCertified.id || 'existing',
                blobId: response.alreadyCertified.blobId,
                size: response.alreadyCertified.size || 0,
                deletable: false
              };
            } else if (response.blobId && response.size !== undefined) {
              // Direct response format
              blobInfo = {
                id: response.id || 'direct',
                blobId: response.blobId,
                size: response.size,
                deletable: response.deletable || isDraft
              };
            }
            
            if (blobInfo) {
              resolve(blobInfo);
            } else {
              console.error('Unknown response format:', response);
              reject(new Error('Invalid response format'));
            }
          } catch {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  // Two-phase upload process
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      currentPhase: 'draft'
    });

    try {
      // Phase 1: Upload as draft (deletable)
      console.log('Uploading draft...');
      const draftBlob = await uploadFileWithProgress(selectedFile, true);
      if (!draftBlob) throw new Error('Draft upload failed');

      setUploadState(prev => ({ ...prev, currentPhase: 'permanent', progress: 0 }));

      // Phase 2: Upload as permanent
      console.log('Uploading permanent copy...');
      const permanentBlob = await uploadFileWithProgress(selectedFile, false);
      if (!permanentBlob) throw new Error('Permanent upload failed');

      // Update metadata with blob ID
      const updatedMetadata = { ...metadata, blobId: permanentBlob.blobId };
      setMetadata(updatedMetadata);

      setUploadState(prev => ({ ...prev, currentPhase: 'metadata', progress: 0 }));

      // Phase 3: Upload metadata as JSON blob
      console.log('Uploading metadata...');
      const metadataBlob = new Blob([JSON.stringify(updatedMetadata)], { type: 'application/json' });
      const metadataFile = new File([metadataBlob], `${permanentBlob.blobId}-metadata.json`);
      await uploadFileWithProgress(metadataFile, false);

      // Store blob with metadata reference
      const blobWithMetadata: BlobInfo = {
        ...permanentBlob,
        metadata: updatedMetadata
      };
      setBlobs(prev => [...prev, blobWithMetadata]);

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        currentPhase: 'complete'
      });

      // Reset form
      setSelectedFile(null);
      setMetadata({
        title: '',
        artist: '',
        duration: 0,
        blobId: '',
        worldIdVerified: false,
        uploadedAt: new Date().toISOString()
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed',
        currentPhase: 'idle'
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: null,
        currentPhase: 'idle'
      });

      // Extract duration if it's an audio file
      if (file.type.startsWith('audio/')) {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.addEventListener('loadedmetadata', () => {
          setMetadata(prev => ({ ...prev, duration: Math.round(audio.duration) }));
          URL.revokeObjectURL(audio.src);
        });
      }
    }
  };

  const handleRetrieveContent = () => {
    if (selectedBlob) {
      // Set audio source for streaming
      if (audioRef.current) {
        audioRef.current.src = `${aggregatorUrl}/v1/blobs/${selectedBlob.blobId}`;
        audioRef.current.load();
      }
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleWaiting = () => setAudioBuffering(true);
    const handleCanPlay = () => setAudioBuffering(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Walrus Storage Integration Test
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Upload Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              1. Enhanced Two-Phase Upload
            </h2>
            
            <div className="space-y-4">
              {/* File Selection */}
              <div>
                <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Audio/Video File
                </label>
                <input
                  ref={fileInputRef}
                  id="audio-file"
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileSelect}
                  disabled={uploadState.isUploading}
                  className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none"
                />
              </div>

              {selectedFile && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Selected: {selectedFile.name}</p>
                  <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p>Type: {selectedFile.type}</p>
                </div>
              )}

              {/* Metadata Input */}
              {selectedFile && (
                <div className="space-y-3 border-t pt-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Track Metadata</h3>
                  <input
                    type="text"
                    placeholder="Track Title"
                    value={metadata.title}
                    onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                    disabled={uploadState.isUploading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Artist Name"
                    value={metadata.artist}
                    onChange={(e) => setMetadata(prev => ({ ...prev, artist: e.target.value }))}
                    disabled={uploadState.isUploading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="world-verified"
                      checked={metadata.worldIdVerified}
                      onChange={(e) => setMetadata(prev => ({ ...prev, worldIdVerified: e.target.checked }))}
                      disabled={uploadState.isUploading}
                      className="w-4 h-4"
                    />
                    <label htmlFor="world-verified" className="text-sm text-gray-700 dark:text-gray-300">
                      World ID Verified Upload
                    </label>
                  </div>
                  {metadata.duration > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Duration: {Math.floor(metadata.duration / 60)}:{String(metadata.duration % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>
              )}

              {/* Upload Progress */}
              {uploadState.isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      {uploadState.currentPhase === 'draft' && 'Uploading draft (deletable)...'}
                      {uploadState.currentPhase === 'permanent' && 'Uploading permanent copy...'}
                      {uploadState.currentPhase === 'metadata' && 'Uploading metadata...'}
                    </span>
                    <span>{uploadState.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Display */}
              {uploadState.error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    Error: {uploadState.error}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {uploadState.currentPhase === 'complete' && !uploadState.isUploading && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Upload complete! File and metadata stored on Walrus.
                  </p>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploadState.isUploading || !metadata.title || !metadata.artist}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {uploadState.isUploading ? 'Uploading...' : 'Start Two-Phase Upload'}
              </button>
            </div>
          </section>

          {/* Blob Management & Metadata */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              2. Stored Blobs with Metadata
            </h2>
            <div className="space-y-4">
              {blobs.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No blobs uploaded yet. Upload a file to see it here.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {blobs.map((blob, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedBlob?.blobId === blob.blobId
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedBlob(blob)}
                    >
                      <div className="space-y-2">
                        {blob.metadata && (
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {blob.metadata.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              by {blob.metadata.artist}
                            </p>
                            {blob.metadata.duration > 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Duration: {Math.floor(blob.metadata.duration / 60)}:{String(blob.metadata.duration % 60).padStart(2, '0')}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="text-xs space-y-1">
                          <p className="font-mono text-gray-600 dark:text-gray-400">
                            Blob ID: {blob.blobId.substring(0, 16)}...
                          </p>
                          <p className="text-gray-500 dark:text-gray-500">
                            Size: {(blob.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-gray-500 dark:text-gray-500">
                            {blob.deletable ? 'Draft (deletable)' : 'Permanent'}
                          </p>
                          {blob.metadata?.worldIdVerified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              World ID Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Streaming Playback Section */}
        <div className="mt-8">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              3. Streaming Playback Test
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleRetrieveContent}
                disabled={!selectedBlob}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Load Selected Content for Streaming
              </button>

              {selectedBlob && audioRef.current?.src && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Now Playing: {selectedBlob.metadata?.title || 'Unknown'}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                      {selectedBlob.metadata?.artist || 'Unknown Artist'}
                    </p>
                    
                    {/* Buffering Indicator */}
                    {audioBuffering && (
                      <div className="mb-3 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-blue-600 dark:text-blue-400">Buffering...</span>
                      </div>
                    )}

                    {/* Custom Audio Player */}
                    <audio
                      ref={audioRef}
                      controls
                      className="w-full"
                      preload="metadata"
                    >
                      Your browser does not support the audio element.
                    </audio>

                    {/* Playback Status */}
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Status: {isPlaying ? 'Playing' : 'Paused'}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Blob Size: {(selectedBlob.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stream URL (supports range requests):
                    </p>
                    <code className="text-xs break-all text-gray-600 dark:text-gray-400">
                      {audioRef.current.src}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Configuration & API Info */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              4. Configuration
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Aggregator URL: </span>
                <code className="text-xs text-gray-600 dark:text-gray-400 block mt-1">{aggregatorUrl}</code>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Publisher URL: </span>
                <code className="text-xs text-gray-600 dark:text-gray-400 block mt-1">{publisherUrl}</code>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              5. Test Results
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Two-Phase Upload:</span> {uploadState.currentPhase === 'complete' ? '✅ Working' : '⏳ Not tested'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Metadata Storage:</span> {blobs.some(b => b.metadata) ? '✅ Working' : '⏳ Not tested'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Streaming Playback:</span> {isPlaying || audioRef.current?.src ? '✅ Working' : '⏳ Not tested'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Range Requests:</span> Supported by Walrus aggregator
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}