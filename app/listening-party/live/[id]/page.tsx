"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SimplePeer from "simple-peer";
import { supabase } from "@/lib/supabase/client";
import { 
  ListeningParty, 
  PartyMessage, 
  PartyParticipant, 
  PlaybackState,
  User 
} from "@/lib/supabase/types";
import SpotifyPlayer from "../../components/SpotifyPlayer";

export default function LiveListeningParty() {
  const params = useParams();
  const router = useRouter();
  const partyId = params.id as string;
  
  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  
  // Party state
  const [party, setParty] = useState<ListeningParty | null>(null);
  const [participants, setParticipants] = useState<PartyParticipant[]>([]);
  const [messages, setMessages] = useState<PartyMessage[]>([]);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    party_id: partyId,
    position_ms: 0,
    is_playing: false,
    updated_at: new Date().toISOString()
  });
  
  // UI state
  const [newMessage, setNewMessage] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // WebRTC refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  console.log(peerRef); // TODO: Implement WebRTC
  const streamRef = useRef<MediaStream | null>(null);
  
  // Realtime subscriptions
  const messagesChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const playbackChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const participantsChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Initialize user and verify
  useEffect(() => {
    const initUser = async () => {
      // For demo, create a temporary user
      const tempUser: User = {
        id: Math.random().toString(36).substring(7),
        username: `User_${Math.floor(Math.random() * 1000)}`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
        created_at: new Date().toISOString()
      };
      setCurrentUser(tempUser);
      setIsVerified(true); // Skip World ID for demo
    };
    
    initUser();
  }, []);

  // Load party data
  useEffect(() => {
    if (!isVerified || !currentUser) return;

    const loadPartyData = async () => {
      try {
        // Fetch party details
        const { data: partyData, error: partyError } = await supabase
          .from('listening_parties')
          .select('*, host:users!host_id(*)')
          .eq('id', partyId)
          .single();

        if (partyError || !partyData) {
          console.error('Party not found:', partyError);
          router.push('/listening-party');
          return;
        }

        setParty(partyData);
        setIsHost(partyData.host_id === currentUser.id);

        // Join party
        await supabase.from('party_participants').upsert({
          party_id: partyId,
          user_id: currentUser.id,
          role: partyData.host_id === currentUser.id ? 'host' : 'participant'
        });

        // Load initial data
        await loadParticipants();
        await loadMessages();
        await loadPlaybackState();

        setLoading(false);
      } catch (error) {
        console.error('Error loading party:', error);
        router.push('/listening-party');
      }
    };

    loadPartyData();
  }, [isVerified, currentUser, partyId, router, loadParticipants, loadMessages, loadPlaybackState]);

  // Load participants
  const loadParticipants = useCallback(async () => {
    const { data } = await supabase
      .from('party_participants')
      .select('*, user:users!user_id(*)')
      .eq('party_id', partyId)
      .is('left_at', null);
    
    if (data) setParticipants(data);
  }, [partyId]);

  // Load messages
  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from('party_messages')
      .select('*, user:users!user_id(*)')
      .eq('party_id', partyId)
      .order('created_at', { ascending: true })
      .limit(50);
    
    if (data) setMessages(data);
  }, [partyId]);

  // Load playback state
  const loadPlaybackState = useCallback(async () => {
    const { data } = await supabase
      .from('party_playback_state')
      .select('*')
      .eq('party_id', partyId)
      .single();
    
    if (data) setPlaybackState(data);
  }, [partyId]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!isVerified || !currentUser) return;

    // Messages subscription
    messagesChannelRef.current = supabase
      .channel(`party-messages:${partyId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'party_messages',
          filter: `party_id=eq.${partyId}`
        },
        async (payload) => {
          // Fetch the complete message with user data
          const { data } = await supabase
            .from('party_messages')
            .select('*, user:users!user_id(*)')
            .eq('id', payload.new.id)
            .single();
          
          if (data) {
            setMessages(prev => [...prev, data]);
          }
        }
      )
      .subscribe();

    // Playback state subscription
    playbackChannelRef.current = supabase
      .channel(`party-playback:${partyId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'party_playback_state',
          filter: `party_id=eq.${partyId}`
        },
        (payload) => {
          setPlaybackState(payload.new as PlaybackState);
        }
      )
      .subscribe();

    // Participants subscription
    participantsChannelRef.current = supabase
      .channel(`party-participants:${partyId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'party_participants',
          filter: `party_id=eq.${partyId}`
        },
        () => {
          loadParticipants();
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current);
      }
      if (playbackChannelRef.current) {
        supabase.removeChannel(playbackChannelRef.current);
      }
      if (participantsChannelRef.current) {
        supabase.removeChannel(participantsChannelRef.current);
      }
    };
  }, [isVerified, currentUser, partyId]);

  // Initialize WebRTC for host
  useEffect(() => {
    if (!isHost || !currentUser) return;

    const initHostStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initHostStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isHost, currentUser]);

  // Handle playback changes
  const handlePlaybackChange = useCallback(async (playing: boolean, position: number) => {
    if (!isHost) return;

    const update = {
      party_id: partyId,
      is_playing: playing,
      position_ms: Math.floor(position * 1000),
      updated_at: new Date().toISOString()
    };

    await supabase
      .from('party_playback_state')
      .upsert(update);
  }, [isHost, partyId]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    await supabase.from('party_messages').insert({
      party_id: partyId,
      user_id: currentUser.id,
      message: newMessage.trim()
    });

    setNewMessage("");
  };

  // Leave party
  const handleLeaveParty = async () => {
    if (!currentUser) return;

    await supabase
      .from('party_participants')
      .update({ left_at: new Date().toISOString() })
      .eq('party_id', partyId)
      .eq('user_id', currentUser.id);

    router.push('/listening-party');
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Verify Your Humanity</h1>
          <p className="text-gray-400 mb-8">
            Live listening parties are for verified humans only.
          </p>
          <button
            onClick={() => setIsVerified(true)}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Verify with World ID
          </button>
        </div>
      </div>
    );
  }

  if (loading || !party) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading party...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-800 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{party.title}</h1>
                <p className="text-gray-400">
                  Hosted by {party.host?.username} • {participants.length} listening
                </p>
              </div>
              <button
                onClick={handleLeaveParty}
                className="text-red-400 hover:text-red-300"
              >
                Leave Party
              </button>
            </div>
          </div>

          {/* Artist Video */}
          <div className="bg-gray-900 p-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {isHost ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    {party.status === 'live' 
                      ? "Artist video will appear here" 
                      : "Waiting for host to start streaming..."}
                  </p>
                </div>
              )}
              
              {/* Host controls overlay */}
              {isHost && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Spotify Player */}
          <div className="bg-gradient-to-b from-purple-900/20 to-transparent p-6">
            <SpotifyPlayer
              trackId={playbackState.track_id || "0qF2Og1j8uCbKsYqplryDH"}
              isHost={isHost}
              onPlaybackChange={handlePlaybackChange}
              syncState={!isHost ? {
                playing: playbackState.is_playing,
                position: playbackState.position_ms / 1000
              } : undefined}
            />
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="bg-gray-900 border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-sm text-gray-400">{participants.length} verified humans</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="flex gap-3">
                <Image
                  src={msg.user?.avatar_url || ''}
                  alt={msg.user?.username || ''}
                  width={32}
                  height={32}
                  className="rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-sm">{msg.user?.username}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}