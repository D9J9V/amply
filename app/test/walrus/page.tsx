'use client';

import { AudioUpload } from '@/components/AudioUpload';
import { useState } from 'react';

export default function WalrusTestPage() {
  const [aggregatorUrl] = useState(
    process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || 
    'https://aggregator.walrus-testnet.walrus.space'
  );
  const [blobIds, setBlobIds] = useState<string[]>([]);
  const [selectedBlobId, setSelectedBlobId] = useState<string>('');
  const [contentUrl, setContentUrl] = useState<string>('');

  const handleAddBlobId = (blobId: string) => {
    setBlobIds(prev => [...prev, blobId]);
  };

  const handleRetrieveContent = () => {
    if (selectedBlobId) {
      setContentUrl(`${aggregatorUrl}/v1/blobs/${selectedBlobId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Walrus Storage Integration Test
        </h1>

        <div className="space-y-8">
          {/* Upload Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              1. Upload Test
            </h2>
            <AudioUpload />
          </section>

          {/* Blob ID Management */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              2. Blob ID Management
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="manual-blob-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add Blob ID Manually
                </label>
                <div className="flex gap-2">
                  <input
                    id="manual-blob-id"
                    type="text"
                    placeholder="Enter blob ID"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value) {
                          handleAddBlobId(input.value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('manual-blob-id') as HTMLInputElement;
                      if (input?.value) {
                        handleAddBlobId(input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {blobIds.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stored Blob IDs:
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {blobIds.map((id, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setSelectedBlobId(id)}
                      >
                        <input
                          type="radio"
                          name="blob-id"
                          checked={selectedBlobId === id}
                          onChange={() => setSelectedBlobId(id)}
                          className="w-4 h-4"
                        />
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate">
                          {id}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Content Retrieval */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              3. Content Retrieval Test
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleRetrieveContent}
                disabled={!selectedBlobId}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Retrieve Selected Content
              </button>

              {contentUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content URL:
                  </p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <code className="text-xs break-all text-gray-600 dark:text-gray-400">
                      {contentUrl}
                    </code>
                  </div>
                  <audio
                    controls
                    src={contentUrl}
                    className="w-full mt-4"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </section>

          {/* Configuration Info */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              4. Configuration
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Aggregator URL: </span>
                <code className="text-xs text-gray-600 dark:text-gray-400">{aggregatorUrl}</code>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Publisher URL: </span>
                <code className="text-xs text-gray-600 dark:text-gray-400">
                  {process.env.NEXT_PUBLIC_WALRUS_PUBLISHER_URL || '[Server-side only]'}
                </code>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}