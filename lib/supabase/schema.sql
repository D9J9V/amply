-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (simplified for now, can integrate with World ID later)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id TEXT UNIQUE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listening parties table
CREATE TABLE listening_parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('scheduled', 'live', 'ended')) DEFAULT 'scheduled',
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Party participants
CREATE TABLE party_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  party_id UUID REFERENCES listening_parties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('host', 'participant')) DEFAULT 'participant',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  UNIQUE(party_id, user_id)
);

-- Chat messages
CREATE TABLE party_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  party_id UUID REFERENCES listening_parties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playback state for synchronization
CREATE TABLE party_playback_state (
  party_id UUID PRIMARY KEY REFERENCES listening_parties(id) ON DELETE CASCADE,
  track_id TEXT,
  track_name TEXT,
  track_artist TEXT,
  track_image TEXT,
  position_ms INTEGER DEFAULT 0,
  is_playing BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Party playlist
CREATE TABLE party_playlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  party_id UUID REFERENCES listening_parties(id) ON DELETE CASCADE,
  spotify_track_id TEXT NOT NULL,
  track_name TEXT NOT NULL,
  track_artist TEXT NOT NULL,
  track_album TEXT,
  track_image TEXT,
  duration_ms INTEGER,
  added_by UUID REFERENCES users(id),
  position INTEGER NOT NULL,
  played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WebRTC signaling data
CREATE TABLE webrtc_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  party_id UUID REFERENCES listening_parties(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id),
  signal_type TEXT CHECK (signal_type IN ('offer', 'answer', 'ice-candidate')),
  signal_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_party_participants_party_id ON party_participants(party_id);
CREATE INDEX idx_party_messages_party_id ON party_messages(party_id);
CREATE INDEX idx_party_playlist_party_id ON party_playlist(party_id);
CREATE INDEX idx_webrtc_signals_party_id ON webrtc_signals(party_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_playback_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_playlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE webrtc_signals ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic for now, can be refined)

-- Users can read all users
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = world_id);

-- Listening parties are viewable by everyone
CREATE POLICY "Listening parties are viewable by everyone" ON listening_parties
  FOR SELECT USING (true);

-- Only hosts can update their parties
CREATE POLICY "Hosts can update their parties" ON listening_parties
  FOR UPDATE USING (host_id = auth.uid());

-- Participants can be viewed by party members
CREATE POLICY "Party participants viewable by party members" ON party_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM party_participants pp 
      WHERE pp.party_id = party_participants.party_id 
      AND pp.user_id = auth.uid()
    )
  );

-- Messages viewable by party members
CREATE POLICY "Messages viewable by party members" ON party_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM party_participants pp 
      WHERE pp.party_id = party_messages.party_id 
      AND pp.user_id = auth.uid()
    )
  );

-- Messages can be inserted by party members
CREATE POLICY "Party members can send messages" ON party_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM party_participants pp 
      WHERE pp.party_id = party_messages.party_id 
      AND pp.user_id = auth.uid()
    )
  );

-- Playback state viewable by party members
CREATE POLICY "Playback state viewable by party members" ON party_playback_state
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM party_participants pp 
      WHERE pp.party_id = party_playback_state.party_id 
      AND pp.user_id = auth.uid()
    )
  );

-- Only host can update playback state
CREATE POLICY "Host can update playback state" ON party_playback_state
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM listening_parties lp 
      WHERE lp.id = party_playback_state.party_id 
      AND lp.host_id = auth.uid()
    )
  );