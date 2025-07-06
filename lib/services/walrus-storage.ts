import { getSupabase } from '@/lib/supabase/client';

export interface WalrusBlobInfo {
  id: string;
  blobId: string;
  size: number;
  contentType?: string;
  metadata?: Record<string, unknown>;
}

export interface ArtistContent {
  id: string;
  artistId: string;
  walrusBlobId: string;
  title: string;
  description?: string;
  contentType: 'track' | 'album' | 'exclusive' | 'video';
  isPrivate: boolean;
  metadata?: {
    duration?: number;
    artist?: string;
    album?: string;
    genre?: string;
  };
  playCount: number;
  createdAt: string;
}

export interface VaultAccess {
  hasAccess: boolean;
  supportTier?: number;
  requiredTier?: number;
}

class WalrusStorageService {
  private aggregatorUrl: string;
  private publisherUrl: string;

  constructor() {
    this.aggregatorUrl = process.env.NEXT_PUBLIC_WALRUS_AGGREGATOR_URL || 
      'https://aggregator.walrus-testnet.walrus.space';
    this.publisherUrl = process.env.NEXT_PUBLIC_WALRUS_PUBLISHER_URL || 
      'https://publisher.walrus-testnet.walrus.space';
  }

  /**
   * Upload a file to Walrus and store metadata in Supabase
   */
  async uploadContent(
    file: File,
    artistId: string,
    contentInfo: {
      title: string;
      description?: string;
      contentType: 'track' | 'album' | 'exclusive' | 'video';
      isPrivate: boolean;
      metadata?: Record<string, unknown>;
    }
  ): Promise<ArtistContent | null> {
    try {
      // Step 1: Upload to Walrus via proxy
      const response = await fetch('/api/walrus-proxy', {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error('Failed to upload to Walrus');
      }

      const walrusResponse = await response.json();
      
      // Extract blob info from response
      let blobId: string;
      let size: number;
      
      if (walrusResponse.newlyCreated?.blobObject) {
        blobId = walrusResponse.newlyCreated.blobObject.blobId;
        size = walrusResponse.newlyCreated.blobObject.size;
      } else if (walrusResponse.alreadyCertified?.blobId) {
        blobId = walrusResponse.alreadyCertified.blobId;
        size = walrusResponse.alreadyCertified.size || file.size;
      } else if (walrusResponse.blobId) {
        blobId = walrusResponse.blobId;
        size = walrusResponse.size || file.size;
      } else {
        throw new Error('Invalid Walrus response format');
      }

      // Step 2: Store blob metadata in Supabase
      const supabase = getSupabase();
      
      // Insert blob info
      const { data: blobData, error: blobError } = await supabase
        .from('walrus_blobs')
        .insert({
          blob_id: blobId,
          size: size,
          content_type: file.type,
          metadata: {
            filename: file.name,
            uploadedAt: new Date().toISOString(),
          }
        })
        .select()
        .single();

      if (blobError) throw blobError;

      // Step 3: Create artist content entry
      const { data: contentData, error: contentError } = await supabase
        .from('artist_content')
        .insert({
          artist_id: artistId,
          walrus_blob_id: blobData.id,
          title: contentInfo.title,
          description: contentInfo.description,
          content_type: contentInfo.contentType,
          is_private: contentInfo.isPrivate,
          metadata: contentInfo.metadata,
        })
        .select()
        .single();

      if (contentError) throw contentError;

      // Step 4: If private, add to vault
      if (contentInfo.isPrivate) {
        const { data: vaultData } = await supabase
          .from('artist_vaults')
          .select('id')
          .eq('artist_id', artistId)
          .single();

        if (vaultData) {
          await supabase
            .from('vault_content')
            .insert({
              vault_id: vaultData.id,
              content_id: contentData.id,
              min_support_tier: 1, // Default to basic tier
            });
        }
      }

      return {
        id: contentData.id,
        artistId: contentData.artist_id,
        walrusBlobId: contentData.walrus_blob_id,
        title: contentData.title,
        description: contentData.description,
        contentType: contentData.content_type,
        isPrivate: contentData.is_private,
        metadata: contentData.metadata,
        playCount: contentData.play_count,
        createdAt: contentData.created_at,
      };
    } catch (error) {
      console.error('Error uploading content:', error);
      return null;
    }
  }

  /**
   * Get content stream URL with access control
   */
  async getContentStreamUrl(
    contentId: string,
    userId?: string
  ): Promise<{ url: string; hasAccess: boolean } | null> {
    try {
      const supabase = getSupabase();

      // Get content and blob info
      const { data: contentData, error: contentError } = await supabase
        .from('artist_content')
        .select(`
          *,
          walrus_blobs!inner(blob_id)
        `)
        .eq('id', contentId)
        .single();

      if (contentError || !contentData) {
        console.error('Content not found:', contentError);
        return null;
      }

      // Check access if content is private
      if (contentData.is_private && userId) {
        const { data: accessData } = await supabase
          .rpc('check_vault_access', {
            p_user_id: userId,
            p_content_id: contentId
          });

        if (!accessData) {
          return { url: '', hasAccess: false };
        }
      } else if (contentData.is_private && !userId) {
        return { url: '', hasAccess: false };
      }

      // Log access
      if (userId) {
        await supabase
          .from('content_access_logs')
          .insert({
            content_id: contentId,
            user_id: userId,
            access_type: 'stream',
            world_id_verified: true, // TODO: Get from session
          });
      }

      // Increment play count
      await supabase.rpc('increment_play_count', { p_content_id: contentId });

      const streamUrl = `${this.aggregatorUrl}/v1/blobs/${contentData.walrus_blobs.blob_id}`;
      return { url: streamUrl, hasAccess: true };
    } catch (error) {
      console.error('Error getting stream URL:', error);
      return null;
    }
  }

  /**
   * Get artist's content list
   */
  async getArtistContent(
    artistId: string,
    includePrivate: boolean = false
  ): Promise<ArtistContent[]> {
    try {
      const supabase = getSupabase();
      
      let query = supabase
        .from('artist_content')
        .select('*')
        .eq('artist_id', artistId)
        .order('created_at', { ascending: false });

      if (!includePrivate) {
        query = query.eq('is_private', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        artistId: item.artist_id,
        walrusBlobId: item.walrus_blob_id,
        title: item.title,
        description: item.description,
        contentType: item.content_type,
        isPrivate: item.is_private,
        metadata: item.metadata,
        playCount: item.play_count,
        createdAt: item.created_at,
      }));
    } catch (error) {
      console.error('Error fetching artist content:', error);
      return [];
    }
  }

  /**
   * Check vault access for a user
   */
  async checkVaultAccess(
    userId: string,
    contentId: string
  ): Promise<VaultAccess> {
    try {
      const supabase = getSupabase();
      
      const { data } = await supabase
        .rpc('check_vault_access', {
          p_user_id: userId,
          p_content_id: contentId
        });

      // Get detailed access info
      const { data: supporterData } = await supabase
        .from('artist_supporters')
        .select('support_tier')
        .eq('supporter_id', userId)
        .single();

      const { data: vaultData } = await supabase
        .from('vault_content')
        .select('min_support_tier')
        .eq('content_id', contentId)
        .single();

      return {
        hasAccess: data || false,
        supportTier: supporterData?.support_tier,
        requiredTier: vaultData?.min_support_tier || 1,
      };
    } catch (error) {
      console.error('Error checking vault access:', error);
      return { hasAccess: false };
    }
  }

  /**
   * Add a supporter to an artist
   */
  async addSupporter(
    artistId: string,
    supporterId: string,
    tier: 1 | 2 | 3 = 1
  ): Promise<boolean> {
    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('artist_supporters')
        .upsert({
          artist_id: artistId,
          supporter_id: supporterId,
          support_tier: tier,
          world_id_verified: true, // TODO: Get from session
        });

      return !error;
    } catch (error) {
      console.error('Error adding supporter:', error);
      return false;
    }
  }
}

export const walrusStorage = new WalrusStorageService();