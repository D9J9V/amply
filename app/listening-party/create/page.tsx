"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateListeningParty() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "Indie",
    maxParticipants: 100,
    startTime: "immediate",
    scheduledTime: "",
    spotifyPlaylistUrl: "",
    allowGuestAdditions: true,
    requireWorldId: true
  });

  const [isCreating, setIsCreating] = useState(false);

  const genres = ["Jazz", "Indie", "Electronic", "Hip-Hop", "Rock", "Pop", "R&B", "Classical"];
  const capacityOptions = [50, 100, 200, 300, 500];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    // Simulate party creation
    setTimeout(() => {
      // In production, this would create the party and redirect to it
      router.push("/listening-party/demo-party");
    }, 1500);
  };

  const handleSpotifyImport = () => {
    // In production, this would trigger Spotify OAuth flow
    alert("Spotify OAuth flow would start here");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/listening-party"
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Parties
          </Link>
          <h1 className="text-4xl font-bold mb-4">Create Listening Party</h1>
          <p className="text-gray-400">
            Host an exclusive music experience with verified humans
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Party Details</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Party Title *
              </label>
              <input
                type="text"
                required
                placeholder="Late Night Jazz Vibes"
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe the vibe and what fans can expect..."
                rows={3}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none resize-none"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Genre
              </label>
              <select
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                value={formData.genre}
                onChange={e => setFormData({ ...formData, genre: e.target.value })}
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Spotify Integration */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Initial Playlist</h2>
            <p className="text-gray-400 text-sm mb-4">
              Import a Spotify playlist to start the party with your favorite tracks
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSpotifyImport}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Connect Spotify
              </button>

              <input
                type="text"
                placeholder="Or paste Spotify playlist URL"
                className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                value={formData.spotifyPlaylistUrl}
                onChange={e => setFormData({ ...formData, spotifyPlaylistUrl: e.target.value })}
              />
            </div>
          </div>

          {/* Party Settings */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Party Settings</h2>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum Participants
              </label>
              <div className="grid grid-cols-5 gap-2">
                {capacityOptions.map(capacity => (
                  <button
                    key={capacity}
                    type="button"
                    onClick={() => setFormData({ ...formData, maxParticipants: capacity })}
                    className={`py-2 rounded-lg font-medium transition-colors ${
                      formData.maxParticipants === capacity
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {capacity}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium mb-2">
                When to Start
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="startTime"
                    value="immediate"
                    checked={formData.startTime === "immediate"}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span>Start immediately</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="startTime"
                    value="scheduled"
                    checked={formData.startTime === "scheduled"}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span>Schedule for later</span>
                </label>
              </div>

              {formData.startTime === "scheduled" && (
                <input
                  type="datetime-local"
                  className="mt-3 w-full bg-black border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                  value={formData.scheduledTime}
                  onChange={e => setFormData({ ...formData, scheduledTime: e.target.value })}
                />
              )}
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowGuestAdditions}
                  onChange={e => setFormData({ ...formData, allowGuestAdditions: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <div>
                  <span className="font-medium">Allow guests to add songs</span>
                  <p className="text-sm text-gray-400">
                    Participants can contribute to the playlist
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireWorldId}
                  onChange={e => setFormData({ ...formData, requireWorldId: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <div>
                  <span className="font-medium">Require World ID verification</span>
                  <p className="text-sm text-gray-400">
                    Ensures all participants are verified humans (recommended)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isCreating || !formData.title}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {isCreating ? "Creating Party..." : "Create Listening Party"}
            </button>
            <Link
              href="/listening-party"
              className="px-6 py-3 rounded-lg font-semibold border border-gray-700 hover:bg-gray-900 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-purple-900/20 border border-purple-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-purple-400">What happens next?</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Your party will appear in the discovery feed</li>
            <li>• Verified humans can join and add songs</li>
            <li>• You control playback for all participants</li>
            <li>• The final playlist becomes an NFT for attendees</li>
          </ul>
        </div>
      </div>
    </div>
  );
}