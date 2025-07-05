-- Disable RLS for MVP Development
-- WARNING: This disables all security. Only use for development!
-- To re-enable RLS, run enable-rls.sql

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE listening_parties DISABLE ROW LEVEL SECURITY;
ALTER TABLE party_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE party_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE party_playback_state DISABLE ROW LEVEL SECURITY;
ALTER TABLE party_playlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE webrtc_signals DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Listening parties are viewable by everyone" ON listening_parties;
DROP POLICY IF EXISTS "Hosts can update their parties" ON listening_parties;
DROP POLICY IF EXISTS "Party participants viewable by party members" ON party_participants;
DROP POLICY IF EXISTS "Messages viewable by party members" ON party_messages;
DROP POLICY IF EXISTS "Party members can send messages" ON party_messages;
DROP POLICY IF EXISTS "Playback state viewable by party members" ON party_playback_state;
DROP POLICY IF EXISTS "Host can update playback state" ON party_playback_state;

-- Create permissive policies for all operations (as backup)
-- These will only apply if RLS gets re-enabled accidentally

-- Users table - allow all operations
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- Listening parties - allow all operations  
CREATE POLICY "Allow all operations on listening_parties" ON listening_parties
  FOR ALL USING (true) WITH CHECK (true);

-- Party participants - allow all operations
CREATE POLICY "Allow all operations on party_participants" ON party_participants
  FOR ALL USING (true) WITH CHECK (true);

-- Party messages - allow all operations
CREATE POLICY "Allow all operations on party_messages" ON party_messages
  FOR ALL USING (true) WITH CHECK (true);

-- Party playback state - allow all operations
CREATE POLICY "Allow all operations on party_playback_state" ON party_playback_state
  FOR ALL USING (true) WITH CHECK (true);

-- Party playlist - allow all operations
CREATE POLICY "Allow all operations on party_playlist" ON party_playlist
  FOR ALL USING (true) WITH CHECK (true);

-- WebRTC signals - allow all operations
CREATE POLICY "Allow all operations on webrtc_signals" ON webrtc_signals
  FOR ALL USING (true) WITH CHECK (true);