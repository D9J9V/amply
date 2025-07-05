export interface User {
  id: string;
  world_id?: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface ListeningParty {
  id: string;
  host_id: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  host?: User;
}

export interface PartyParticipant {
  id: string;
  party_id: string;
  user_id: string;
  role: 'host' | 'participant';
  joined_at: string;
  left_at?: string;
  user?: User;
}

export interface PartyMessage {
  id: string;
  party_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: User;
}

export interface PlaybackState {
  party_id: string;
  track_id?: string;
  track_name?: string;
  track_artist?: string;
  track_image?: string;
  position_ms: number;
  is_playing: boolean;
  updated_at: string;
}

export interface PartyTrack {
  id: string;
  party_id: string;
  spotify_track_id: string;
  track_name: string;
  track_artist: string;
  track_album?: string;
  track_image?: string;
  duration_ms?: number;
  added_by?: string;
  position: number;
  played_at?: string;
  created_at: string;
  user?: User;
}

export interface WebRTCSignal {
  id: string;
  party_id: string;
  from_user_id: string;
  to_user_id?: string;
  signal_type: 'offer' | 'answer' | 'ice-candidate';
  signal_data: unknown;
  created_at: string;
}