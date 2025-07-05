"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { PartyParticipant } from "@/lib/supabase/types";

interface PartyPresenceProps {
  partyId: string;
  currentUserId: string;
  maxDisplay?: number;
}

export default function PartyPresence({ 
  partyId, 
  currentUserId,
  maxDisplay = 10 
}: PartyPresenceProps) {
  const [participants, setParticipants] = useState<PartyParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipants = async () => {
      const { data } = await supabase
        .from('party_participants')
        .select('*, user:users!user_id(*)')
        .eq('party_id', partyId)
        .is('left_at', null)
        .order('joined_at', { ascending: true });
      
      if (data) {
        setParticipants(data);
      }
      setLoading(false);
    };

    loadParticipants();

    // Subscribe to participant changes
    const channel = supabase
      .channel(`presence:${partyId}`)
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

    // Update heartbeat for current user
    const heartbeatInterval = setInterval(async () => {
      await supabase
        .from('party_participants')
        .update({ joined_at: new Date().toISOString() })
        .eq('party_id', partyId)
        .eq('user_id', currentUserId);
    }, 30000); // Every 30 seconds

    return () => {
      supabase.removeChannel(channel);
      clearInterval(heartbeatInterval);
    };
  }, [partyId, currentUserId]);

  if (loading) {
    return (
      <div className="animate-pulse flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-700 rounded-full"></div>
        ))}
      </div>
    );
  }

  const displayedParticipants = participants.slice(0, maxDisplay);
  const remainingCount = participants.length - maxDisplay;

  return (
    <div className="flex items-center">
      {/* Participant Avatars */}
      <div className="flex -space-x-3">
        {displayedParticipants.map((participant) => (
          <div
            key={participant.id}
            className="relative group"
          >
            <div className="relative">
              <Image
                src={participant.user?.avatar_url || ''}
                alt={participant.user?.username || ''}
                width={36}
                height={36}
                className="rounded-full border-2 border-gray-900 hover:z-10 transition-all"
              />
              {participant.role === 'host' && (
                <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              {participant.user?.username}
              {participant.role === 'host' && ' (Host)'}
            </div>
          </div>
        ))}
        
        {/* Remaining Count */}
        {remainingCount > 0 && (
          <div className="flex items-center justify-center w-9 h-9 bg-gray-700 rounded-full border-2 border-gray-900 text-xs font-medium">
            +{remainingCount}
          </div>
        )}
      </div>

      {/* Total Count */}
      <div className="ml-4 text-sm text-gray-400">
        {participants.length} {participants.length === 1 ? 'person' : 'people'} here
      </div>
    </div>
  );
}