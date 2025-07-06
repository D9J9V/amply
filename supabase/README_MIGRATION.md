# Walrus Storage Migration Instructions

To enable the Walrus storage functionality with private vaults, you need to run the following migration on your Supabase database:

## Steps:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `/lib/supabase/walrus-storage-schema.sql`
4. Paste and run the SQL in the editor

## What this migration adds:

### New Tables:
- `walrus_blobs` - Stores Walrus blob metadata
- `artist_content` - Links artists to their uploaded content
- `artist_vaults` - Manages artist private vaults
- `vault_content` - Maps content to vaults with access tiers
- `artist_supporters` - Tracks supporter relationships
- `content_access_logs` - Analytics for content access

### New Functions:
- `check_vault_access()` - Verifies if a user can access vault content
- `increment_play_count()` - Updates play statistics
- `update_updated_at_column()` - Auto-updates timestamps

## Testing:

After running the migration, you can test the functionality at:
- `/artist` - Upload content with private vault option
- `/demo/walrus-vault` - See the full supporter/vault flow
- `/test/walrus` - Test raw Walrus upload/retrieve

## Environment Variables:

Make sure you have these set in your `.env.local`:
```
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
```