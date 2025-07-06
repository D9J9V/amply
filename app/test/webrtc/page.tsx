"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SimplePeer from "simple-peer";
import { supabase } from "@/lib/supabase/client";

export default function TestWebRTC() {
  const [role, setRole] = useState<'host' | 'viewer' | null>(null);
  const [channelId, setChannelId] = useState("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState("Idle");
  const [logs, setLogs] = useState<string[]>([]);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[WebRTC Test] ${message}`);
  };

  // Start as host
  const startAsHost = async () => {
    try {
      setRole('host');
      addLog("Starting as host...");
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      addLog(`Got local stream: ${stream.getTracks().map(t => t.kind).join(', ')}`);
      
      // Subscribe to channel
      const channel = `test-webrtc-${channelId}`;
      channelRef.current = supabase.channel(channel)
        .on('broadcast', { event: 'signal' }, ({ payload }) => {
          handleSignal(payload);
        })
        .subscribe((status) => {
          addLog(`Channel subscription: ${status}`);
          if (status === 'SUBSCRIBED') {
            setStatus("Waiting for viewer...");
          }
        });
        
    } catch (err) {
      addLog(`Error: ${err}`);
      setStatus("Error");
    }
  };

  // Start as viewer
  const startAsViewer = async () => {
    try {
      setRole('viewer');
      addLog("Starting as viewer...");
      
      // Subscribe to channel
      const channel = `test-webrtc-${channelId}`;
      channelRef.current = supabase.channel(channel)
        .on('broadcast', { event: 'signal' }, ({ payload }) => {
          handleSignal(payload);
        })
        .subscribe((status) => {
          addLog(`Channel subscription: ${status}`);
          if (status === 'SUBSCRIBED') {
            setStatus("Creating offer...");
            createPeer(true);
          }
        });
        
    } catch (err) {
      addLog(`Error: ${err}`);
      setStatus("Error");
    }
  };

  // Create peer connection
  const createPeer = (initiator: boolean) => {
    addLog(`Creating peer (initiator: ${initiator})`);
    
    const peer = new SimplePeer({
      initiator,
      stream: localStream || undefined,
      trickle: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', (data) => {
      addLog(`Sending signal: ${data.type || 'ice-candidate'}`);
      channelRef.current?.send({
        type: 'broadcast',
        event: 'signal',
        payload: {
          from: role,
          signal: data
        }
      });
    });

    peer.on('stream', (stream) => {
      addLog(`Received stream: ${stream.getTracks().map(t => t.kind).join(', ')}`);
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    peer.on('connect', () => {
      addLog("Peer connected!");
      setStatus("Connected");
    });

    peer.on('error', (err) => {
      addLog(`Peer error: ${err.message}`);
      setStatus("Error");
    });

    peer.on('close', () => {
      addLog("Peer closed");
      setStatus("Disconnected");
    });

    peerRef.current = peer;
  };

  // Handle incoming signals
  const handleSignal = (payload: { from: string; signal: SimplePeer.SignalData }) => {
    if (payload.from === role) return; // Ignore own signals
    
    addLog(`Received signal from ${payload.from}: ${payload.signal.type || 'ice-candidate'}`);
    
    if (!peerRef.current && role === 'host') {
      // Host creates peer on first offer
      createPeer(false);
    }
    
    if (peerRef.current) {
      peerRef.current.signal(payload.signal);
    }
  };

  // Stop connection
  const stop = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    
    setRole(null);
    setRemoteStream(null);
    setStatus("Idle");
    addLog("Stopped");
  };

  // Update video elements when streams change
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/test"
          className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
        >
          ← Back to Test Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">WebRTC Direct Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Setup */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Setup</h2>
            
            {!role ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Channel ID</label>
                  <input
                    type="text"
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2"
                    placeholder="Enter a channel ID"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={startAsHost}
                    disabled={!channelId}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 px-4 py-2 rounded"
                  >
                    Start as Host
                  </button>
                  <button
                    onClick={startAsViewer}
                    disabled={!channelId}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-4 py-2 rounded"
                  >
                    Start as Viewer
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p>Role: <span className="text-purple-400 font-semibold">{role}</span></p>
                <p>Channel: <span className="text-purple-400 font-mono">{channelId}</span></p>
                <p>Status: <span className="text-green-400 font-semibold">{status}</span></p>
                <button
                  onClick={stop}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Stop
                </button>
              </div>
            )}
          </div>

          {/* Logs */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Logs</h2>
            <div className="bg-black rounded p-4 h-64 overflow-y-auto text-xs font-mono">
              {logs.map((log, i) => (
                <div key={i} className="text-gray-400">{log}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Local Video</h3>
            <div className="aspect-video bg-black rounded overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Remote Video</h3>
            <div className="aspect-video bg-black rounded overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-400">
            <li>Enter the same channel ID on both devices</li>
            <li>Click &quot;Start as Host&quot; on the device that will stream</li>
            <li>Click &quot;Start as Viewer&quot; on the device that will watch</li>
            <li>The connection should establish automatically</li>
            <li>Check the logs for any errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}