'use client';

import { useState } from 'react';
import { useWalrusUpload } from '@/hooks/useWalrusUpload';

export function AudioUpload() {
  const { uploadFile, resetUpload, isUploading, progress, error } = useWalrusUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedBlobId, setUploadedBlobId] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      resetUpload();
      setUploadedBlobId(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // TODO: Get actual World ID token from authentication
    const result = await uploadFile(selectedFile, {
      isDraft: false,
      worldIdToken: 'mock-world-id-token', // Replace with actual token
    });

    if (result.success && result.blobId) {
      setUploadedBlobId(result.blobId);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Upload Audio
      </h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Audio File
          </label>
          <input
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none"
          />
        </div>

        {selectedFile && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {uploadedBlobId && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              Upload successful!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-mono break-all">
              Blob ID: {uploadedBlobId}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Upload to Walrus'}
        </button>
      </div>
    </div>
  );
}