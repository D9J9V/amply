-- Walrus Storage Schema for Amply
-- This schema supports artist vaults, private content, and supporter access control

-- Table for storing Walrus blob metadata
CREATE TABLE IF NOT EXISTS walrus_blobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blob_id TEXT NOT NULL UNIQUE,
  size BIGINT NOT NULL,
  content_type TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for artist content (tracks, albums, exclusive content)
CREATE TABLE IF NOT EXISTS artist_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES users(id) ON DELETE CASCADE,
  walrus_blob_id UUID REFERENCES walrus_blobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('track', 'album', 'exclusive', 'video')),
  is_private BOOLEAN DEFAULT false,
  metadata JSONB, -- Duration, genre, etc.
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for artist private vaults
CREATE TABLE IF NOT EXISTS artist_vaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  vault_name TEXT NOT NULL,
  description TEXT,
  api_key_hash TEXT NOT NULL, -- Hashed API key for vault access
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for vault content (private content that requires supporter access)
CREATE TABLE IF NOT EXISTS vault_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vault_id UUID REFERENCES artist_vaults(id) ON DELETE CASCADE,
  content_id UUID REFERENCES artist_content(id) ON DELETE CASCADE,
  min_support_tier INTEGER DEFAULT 1, -- Minimum tier required (1=basic, 2=premium, 3=vip)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vault_id, content_id)
);

-- Table for artist supporters (fans who support artists)
CREATE TABLE IF NOT EXISTS artist_supporters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES users(id) ON DELETE CASCADE,
  supporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  support_tier INTEGER DEFAULT 1 CHECK (support_tier IN (1, 2, 3)),
  world_id_verified BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  UNIQUE(artist_id, supporter_id)
);

-- Table for content access logs (for analytics)
CREATE TABLE IF NOT EXISTS content_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES artist_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  access_type TEXT CHECK (access_type IN ('stream', 'download')),
  world_id_verified BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_artist_content_artist_id ON artist_content(artist_id);
CREATE INDEX idx_artist_content_is_private ON artist_content(is_private);
CREATE INDEX idx_vault_content_vault_id ON vault_content(vault_id);
CREATE INDEX idx_artist_supporters_artist_id ON artist_supporters(artist_id);
CREATE INDEX idx_artist_supporters_supporter_id ON artist_supporters(supporter_id);
CREATE INDEX idx_content_access_logs_content_id ON content_access_logs(content_id);
CREATE INDEX idx_content_access_logs_user_id ON content_access_logs(user_id);

-- Function to check if a user has access to vault content
CREATE OR REPLACE FUNCTION check_vault_access(
  p_user_id UUID,
  p_content_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_is_private BOOLEAN;
  v_artist_id UUID;
  v_required_tier INTEGER;
  v_user_tier INTEGER;
BEGIN
  -- Get content details
  SELECT ac.is_private, ac.artist_id
  INTO v_is_private, v_artist_id
  FROM artist_content ac
  WHERE ac.id = p_content_id;

  -- If content doesn't exist, deny access
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- If content is public, allow access
  IF NOT v_is_private THEN
    RETURN TRUE;
  END IF;

  -- If user is the artist, allow access
  IF p_user_id = v_artist_id THEN
    RETURN TRUE;
  END IF;

  -- Check if user is a supporter with sufficient tier
  SELECT 
    COALESCE(vc.min_support_tier, 1),
    COALESCE(asp.support_tier, 0)
  INTO v_required_tier, v_user_tier
  FROM artist_content ac
  LEFT JOIN vault_content vc ON vc.content_id = ac.id
  LEFT JOIN artist_supporters asp ON asp.artist_id = ac.artist_id 
    AND asp.supporter_id = p_user_id 
    AND asp.ended_at IS NULL
  WHERE ac.id = p_content_id;

  RETURN v_user_tier >= v_required_tier;
END;
$$ LANGUAGE plpgsql;

-- Function to increment play count
CREATE OR REPLACE FUNCTION increment_play_count(p_content_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE artist_content 
  SET play_count = play_count + 1,
      updated_at = NOW()
  WHERE id = p_content_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_artist_content_updated_at BEFORE UPDATE ON artist_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artist_vaults_updated_at BEFORE UPDATE ON artist_vaults
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
-- Note: In production, api_key_hash should be properly hashed
INSERT INTO artist_vaults (artist_id, vault_name, description, api_key_hash)
SELECT id, 'Exclusive Vault', 'Premium content for my supporters', 'demo_api_key_hash'
FROM users
WHERE username = 'demo_artist'
ON CONFLICT DO NOTHING;