"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function TestListeningParty() {
  const [testResults, setTestResults] = useState<{[key: string]: {
    success: boolean;
    message: string;
    data?: unknown;
    error?: unknown;
    payload?: unknown;
    status?: string;
    videoTracks?: number;
    audioTracks?: number;
  }}>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  const addTestResult = (testName: string, result: {
    success: boolean;
    message: string;
    data?: unknown;
    error?: unknown;
    payload?: unknown;
    status?: string;
    videoTracks?: number;
    audioTracks?: number;
  }) => {
    setTestResults(prev => ({ ...prev, [testName]: result }));
  };

  // Test Supabase connection
  const testSupabaseConnection = async () => {
    setLoading(prev => ({ ...prev, connection: true }));
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count(*)')
        .limit(1);
      
      addTestResult('connection', {
        success: !error,
        message: error ? error.message : 'Connected successfully',
        data
      });
    } catch (error) {
      addTestResult('connection', {
        success: false,
        message: error.message || 'Connection failed',
        error: error instanceof Error ? error.message : String(error)
      });
    }
    setLoading(prev => ({ ...prev, connection: false }));
  };

  // Test creating a user
  const testCreateUser = async () => {
    setLoading(prev => ({ ...prev, createUser: true }));
    try {
      const testUser = {
        id: `test_${Date.now()}`,
        username: `TestUser_${Math.floor(Math.random() * 1000)}`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
      };

      const { data, error } = await supabase
        .from('users')
        .insert(testUser)
        .select()
        .single();

      addTestResult('createUser', {
        success: !error,
        message: error ? error.message : 'User created successfully',
        data
      });
    } catch (error) {
      addTestResult('createUser', {
        success: false,
        message: error.message || 'Failed to create user',
        error: error instanceof Error ? error.message : String(error)
      });
    }
    setLoading(prev => ({ ...prev, createUser: false }));
  };

  // Test creating a party
  const testCreateParty = async () => {
    setLoading(prev => ({ ...prev, createParty: true }));
    try {
      // First create a host user
      const hostId = `host_${Date.now()}`;
      await supabase.from('users').insert({
        id: hostId,
        username: `Host_${Math.floor(Math.random() * 1000)}`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
      });

      // Create party
      const { data, error } = await supabase
        .from('listening_parties')
        .insert({
          host_id: hostId,
          title: `Test Party ${new Date().toLocaleTimeString()}`,
          description: 'This is a test party',
          status: 'live'
        })
        .select()
        .single();

      if (!error && data) {
        // Initialize playback state
        await supabase.from('party_playback_state').insert({
          party_id: data.id,
          position_ms: 0,
          is_playing: false
        });
      }

      addTestResult('createParty', {
        success: !error,
        message: error ? error.message : 'Party created successfully',
        data
      });
    } catch (error) {
      addTestResult('createParty', {
        success: false,
        message: error.message || 'Failed to create party',
        error: error instanceof Error ? error.message : String(error)
      });
    }
    setLoading(prev => ({ ...prev, createParty: false }));
  };

  // Test realtime subscription
  const testRealtimeSubscription = async () => {
    setLoading(prev => ({ ...prev, realtime: true }));
    try {
      const channel = supabase
        .channel('test-channel')
        .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
          addTestResult('realtime', {
            success: true,
            message: 'Realtime event received',
            payload
          });
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            addTestResult('realtime', {
              success: true,
              message: 'Successfully subscribed to realtime',
              status
            });
          }
        });

      // Cleanup after 5 seconds
      setTimeout(() => {
        supabase.removeChannel(channel);
        setLoading(prev => ({ ...prev, realtime: false }));
      }, 5000);
    } catch (error) {
      addTestResult('realtime', {
        success: false,
        message: error.message || 'Realtime subscription failed',
        error: error instanceof Error ? error.message : String(error)
      });
      setLoading(prev => ({ ...prev, realtime: false }));
    }
  };

  // Test WebRTC camera access
  const testWebRTC = async () => {
    setLoading(prev => ({ ...prev, webrtc: true }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Stop all tracks after getting them
      stream.getTracks().forEach(track => track.stop());

      addTestResult('webrtc', {
        success: true,
        message: 'Camera and microphone access granted',
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length
      });
    } catch (error) {
      addTestResult('webrtc', {
        success: false,
        message: (error instanceof Error ? error.message : String(error)) || 'Failed to access camera/microphone',
        error: error instanceof Error ? error.name : String(error)
      });
    }
    setLoading(prev => ({ ...prev, webrtc: false }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/test"
          className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
        >
          ← Back to Test Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Live Listening Party Tests</h1>
        
        <div className="space-y-6">
          {/* Supabase Connection Test */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Supabase Connection</h2>
            <button
              onClick={testSupabaseConnection}
              disabled={loading.connection}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 px-4 py-2 rounded-lg"
            >
              {loading.connection ? 'Testing...' : 'Test Connection'}
            </button>
            {testResults.connection && (
              <div className={`mt-4 p-4 rounded-lg ${testResults.connection.success ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'}`}>
                <p className={testResults.connection.success ? 'text-green-400' : 'text-red-400'}>
                  {testResults.connection.message}
                </p>
                {testResults.connection.data && (
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(testResults.connection.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Create User Test */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <button
              onClick={testCreateUser}
              disabled={loading.createUser}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 px-4 py-2 rounded-lg"
            >
              {loading.createUser ? 'Creating...' : 'Create Test User'}
            </button>
            {testResults.createUser && (
              <div className={`mt-4 p-4 rounded-lg ${testResults.createUser.success ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'}`}>
                <p className={testResults.createUser.success ? 'text-green-400' : 'text-red-400'}>
                  {testResults.createUser.message}
                </p>
                {testResults.createUser.data && (
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(testResults.createUser.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Create Party Test */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create Listening Party</h2>
            <button
              onClick={testCreateParty}
              disabled={loading.createParty}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 px-4 py-2 rounded-lg"
            >
              {loading.createParty ? 'Creating...' : 'Create Test Party'}
            </button>
            {testResults.createParty && (
              <div className={`mt-4 p-4 rounded-lg ${testResults.createParty.success ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'}`}>
                <p className={testResults.createParty.success ? 'text-green-400' : 'text-red-400'}>
                  {testResults.createParty.message}
                </p>
                {testResults.createParty.data && (
                  <div className="mt-2">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(testResults.createParty.data, null, 2)}
                    </pre>
                    {testResults.createParty.data.id && (
                      <Link
                        href={`/listening-party/live/${testResults.createParty.data.id}`}
                        className="inline-block mt-2 text-purple-400 hover:text-purple-300"
                      >
                        View Created Party →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Realtime Test */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Realtime Subscription</h2>
            <button
              onClick={testRealtimeSubscription}
              disabled={loading.realtime}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 px-4 py-2 rounded-lg"
            >
              {loading.realtime ? 'Listening for 5s...' : 'Test Realtime'}
            </button>
            {testResults.realtime && (
              <div className={`mt-4 p-4 rounded-lg ${testResults.realtime.success ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'}`}>
                <p className={testResults.realtime.success ? 'text-green-400' : 'text-red-400'}>
                  {testResults.realtime.message}
                </p>
                {testResults.realtime.payload && (
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(testResults.realtime.payload, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* WebRTC Test */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">WebRTC Camera/Mic Access</h2>
            <button
              onClick={testWebRTC}
              disabled={loading.webrtc}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 px-4 py-2 rounded-lg"
            >
              {loading.webrtc ? 'Requesting access...' : 'Test Camera & Mic'}
            </button>
            {testResults.webrtc && (
              <div className={`mt-4 p-4 rounded-lg ${testResults.webrtc.success ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'}`}>
                <p className={testResults.webrtc.success ? 'text-green-400' : 'text-red-400'}>
                  {testResults.webrtc.message}
                </p>
                {testResults.webrtc.success && (
                  <div className="mt-2 text-sm">
                    <p>Video tracks: {testResults.webrtc.videoTracks}</p>
                    <p>Audio tracks: {testResults.webrtc.audioTracks}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Link
                href="/listening-party"
                className="block text-purple-400 hover:text-purple-300"
              >
                → View All Listening Parties
              </Link>
              <Link
                href="/listening-party/create-live"
                className="block text-purple-400 hover:text-purple-300"
              >
                → Create Live Party
              </Link>
              <Link
                href="/listening-party/create"
                className="block text-purple-400 hover:text-purple-300"
              >
                → Create Regular Party
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}