-- Re-enable RLS for Production
-- Run this when you're ready to implement proper authentication

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_playback_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_playlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE webrtc_signals ENABLE ROW LEVEL SECURITY;

-- Drop permissive policies
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Allow all operations on listening_parties" ON listening_parties;
DROP POLICY IF EXISTS "Allow all operations on party_participants" ON party_participants;
DROP POLICY IF EXISTS "Allow all operations on party_messages" ON party_messages;
DROP POLICY IF EXISTS "Allow all operations on party_playback_state" ON party_playback_state;
DROP POLICY IF EXISTS "Allow all operations on party_playlist" ON party_playlist;
DROP POLICY IF EXISTS "Allow all operations on webrtc_signals" ON webrtc_signals;

-- Restore original RLS policies

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