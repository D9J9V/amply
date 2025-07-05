"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { 
  ListeningParty, 
  PartyMessage, 
  PlaybackState,
  User 
} from "@/lib/supabase/types";
import { useWebRTC } from "@/hooks/useWebRTC";
import SyncedSpotifyPlayer from "../../components/SyncedSpotifyPlayer";
import PartyPlaylist from "../../components/PartyPlaylist";
import PartyPresence from "../../components/PartyPresence";

export default function LiveListeningParty() {
  const params = useParams();
  const router = useRouter();
  const partyId = params.id as string;
  
  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  
  // Party state
  const [party, setParty] = useState<ListeningParty | null>(null);
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
  
  // WebRTC hook
  const {
    localStream,
    remoteStream,
    isConnecting,
    isConnected,
    error: webrtcError,
    videoRef,
    remoteVideoRef,
    toggleAudio,
    toggleVideo,
    getMediaStates
  } = useWebRTC({
    partyId,
    userId: currentUser?.id || '',
    isHost,
    enabled: isVerified && !!currentUser && !!party
  });
  
  // Realtime subscriptions
  const messagesChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const playbackChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);


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
        await loadMessages();
        await loadPlaybackState();

        setLoading(false);
      } catch (error) {
        console.error('Error loading party:', error);
        router.push('/listening-party');
      }
    };

    loadPartyData();
  }, [isVerified, currentUser, partyId, router, loadMessages, loadPlaybackState]);

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


    // Cleanup
    return () => {
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current);
      }
      if (playbackChannelRef.current) {
        supabase.removeChannel(playbackChannelRef.current);
      }
    };
  }, [isVerified, currentUser, partyId]);



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
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{party.title}</h1>
                <div className="flex items-center gap-6">
                  <p className="text-gray-400">
                    Hosted by {party.host?.username}
                  </p>
                  <PartyPresence 
                    partyId={partyId}
                    currentUserId={currentUser?.id || ''}
                    maxDisplay={5}
                  />
                </div>
              </div>
              <button
                onClick={handleLeaveParty}
                className="text-red-400 hover:text-red-300 ml-4"
              >
                Leave Party
              </button>
            </div>
          </div>

          {/* Artist Video */}
          <div className="bg-gray-900 p-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {isHost ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {webrtcError && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-red-400 mb-2">{webrtcError}</p>
                        <button 
                          onClick={() => window.location.reload()}
                          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {remoteStream ? (
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        {isConnecting ? (
                          <>
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto mb-2"></div>
                            <p className="text-gray-400">Connecting to stream...</p>
                          </>
                        ) : (
                          <p className="text-gray-500">
                            {party.status === 'live' 
                              ? "Waiting for artist to start streaming..." 
                              : "The party hasn't started yet"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Host controls overlay */}
              {isHost && localStream && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <button 
                    onClick={toggleAudio}
                    className={`${
                      getMediaStates().audio ? 'bg-gray-800' : 'bg-red-600'
                    } hover:opacity-80 p-2 rounded-lg transition-all`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {getMediaStates().audio ? (
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                      ) : (
                        <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                      )}
                    </svg>
                  </button>
                  <button 
                    onClick={toggleVideo}
                    className={`${
                      getMediaStates().video ? 'bg-gray-800' : 'bg-red-600'
                    } hover:opacity-80 p-2 rounded-lg transition-all`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {getMediaStates().video ? (
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                      ) : (
                        <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/>
                      )}
                    </svg>
                  </button>
                </div>
              )}

              {/* Connection status */}
              {isHost && (
                <div className="absolute top-4 right-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                    isConnected ? 'bg-green-900/80 text-green-300' : 'bg-gray-900/80 text-gray-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-green-400' : 'bg-gray-600'
                    }`}></div>
                    {isConnected ? 'Live' : 'No viewers'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Spotify Player */}
          <div className="bg-gradient-to-b from-purple-900/20 to-transparent p-6">
            <SyncedSpotifyPlayer
              partyId={partyId}
              isHost={isHost}
              currentTrack={playbackState.track_id ? {
                id: playbackState.track_id,
                name: playbackState.track_name || 'Unknown Track',
                artist: playbackState.track_artist || 'Unknown Artist',
                image: playbackState.track_image,
                duration: 300000 // Default 5 minutes, would come from Spotify API
              } : undefined}
            />
          </div>

          {/* Playlist */}
          <div className="flex-1 overflow-y-auto p-6">
            <PartyPlaylist
              partyId={partyId}
              isHost={isHost}
              currentUserId={currentUser?.id || ''}
            />
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="bg-gray-900 border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-sm text-gray-400">Verified humans only</p>
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