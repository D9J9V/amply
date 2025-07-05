"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function CreateLiveListeningParty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get or create user for MVP demo
      const userId = localStorage.getItem('amply_demo_user_id');
      let user;
      
      if (!userId) {
        // Create a new user
        const newUser = {
          id: crypto.randomUUID(),
          username: `Artist_${Math.floor(Math.random() * 1000)}`,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
        };
        
        const { data, error } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();
        
        if (error) throw error;
        
        user = data;
        localStorage.setItem('amply_demo_user_id', data.id);
      } else {
        // Get existing user
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (data) {
          user = data;
        } else {
          // User not found, clear and retry
          localStorage.removeItem('amply_demo_user_id');
          return handleSubmit(e);
        }
      }

      // Create the live party
      const { data: party, error } = await supabase
        .from('listening_parties')
        .insert({
          host_id: user.id,
          title: formData.title,
          description: formData.description,
          status: 'live',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Initialize playback state
      await supabase.from('party_playback_state').insert({
        party_id: party.id,
        position_ms: 0,
        is_playing: false
      });

      // Redirect to the live party
      router.push(`/listening-party/live/${party.id}`);
    } catch (error) {
      console.error('Error creating party:', error);
      alert('Failed to create party. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto p-8">
        <Link
          href="/listening-party"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Listening Parties
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Go Live Now 🎵</h1>
          <p className="text-gray-400 text-lg">
            Start streaming and share your music with verified humans
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                What are you streaming?
              </label>
              <input
                id="title"
                type="text"
                required
                placeholder="Acoustic Session from My Studio"
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none text-lg"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Tell your audience what to expect (optional)
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Playing tracks from my new album and taking requests..."
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Ready to go live?
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✓ Your webcam & microphone will be enabled</li>
              <li>✓ You control the Spotify playback for everyone</li>
              <li>✓ Fans can chat and add songs to the queue</li>
              <li>✓ All participants are verified humans</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.title}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 py-4 rounded-lg font-semibold transition-all transform hover:scale-[1.02] disabled:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting your live party...
              </span>
            ) : (
              "Start Live Party 🚀"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By going live, you agree to our community guidelines.</p>
          <p>Your stream will be visible to all Amply users.</p>
        </div>
      </div>
    </div>
  );
}