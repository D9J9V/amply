# Walrus HTTP API Implementation Guide

## Overview
This guide provides specific implementation instructions for integrating Walrus decentralized storage into the Amply platform. Walrus is used for storing all audio/video content in a permanent, censorship-resistant manner.

## Core Operations

The Walrus API supports 4 essential operations for the Amply platform:
- **Upload/Store**: Publishing audio/video content to the network
- **Read**: Retrieving content for playback
- **Attest**: Verifying content integrity
- **Delete**: Removing content (only for deletable blobs)

## API Endpoints

### Testnet Configuration
For development and testing, use Mysten's recommended services:

```bash
AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
PUBLISHER=https://publisher.walrus-testnet.walrus.space
```

Full list of testnet publishers and aggregators: https://docs.wal.app/usage/web-api.html#testnet

## Implementation Examples

### 1. Uploading Audio/Video Content

When an artist uploads content through `/artist/[handle]/upload`:

```bash
# Store audio file permanently
curl -X PUT "$PUBLISHER/v1/blobs" \
  --upload-file "./audio/track.mp3" \
  -H "Content-Type: audio/mpeg"

# Store with deletion capability (for draft uploads)
curl -X PUT "$PUBLISHER/v1/blobs?deletable=true" \
  --upload-file "./audio/draft.mp3" \
  -H "Content-Type: audio/mpeg"
```

### 2. Storing Content Metadata

```javascript
// Example: Uploading content from the browser
async function uploadToWalrus(file) {
  const response = await fetch(`${PUBLISHER}/v1/blobs`, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });
  
  const result = await response.json();
  // Returns: { blobId: "xyz...", ... }
  return result.blobId; // Store this in NFT metadata
}
```

### 3. Reading Content for Playback

```javascript
// Retrieve audio/video for streaming
async function getContentUrl(blobId) {
  return `${AGGREGATOR}/v1/blobs/${blobId}`;
}

// For web embedding (more reliable than <img> for media)
function embedAudio(blobId) {
  return `<object data="${AGGREGATOR}/v1/blobs/${blobId}" type="audio/mpeg">
    <param name="autoplay" value="false">
  </object>`;
}
```

### 4. Integration with NFT Metadata

When minting master NFTs, store the Walrus blob ID in the NFT metadata:

```javascript
const nftMetadata = {
  name: "Track Title",
  artist: "Artist Name",
  walrusBlobId: "xyz123...", // The blob ID from upload
  contentType: "audio/mpeg",
  duration: 180, // seconds
  genre: "indie",
  verified: true // World ID verification status
};
```

## Best Practices for Amply

1. **Content Upload Flow**:
   - Use deletable blobs during the upload/preview phase
   - Convert to permanent storage once the artist confirms publication
   - Store the blob ID immediately in your database

2. **Playback Optimization**:
   - Cache aggregator URLs for frequently accessed content
   - Implement progressive loading for large audio files
   - Use appropriate `Content-Type` headers for proper playback

3. **Error Handling**:
   ```javascript
   async function safeUpload(file) {
     try {
       const blobId = await uploadToWalrus(file);
       if (!blobId) throw new Error('No blob ID received');
       return { success: true, blobId };
     } catch (error) {
       console.error('Walrus upload failed:', error);
       return { success: false, error: error.message };
     }
   }
   ```

4. **Content Verification**:
   - Always verify the blob ID after upload
   - Test retrieval immediately after storage
   - Implement retry logic for network failures

## API Response Examples

### Successful Upload Response:
```json
{
  "blobId": "0x7e4b8d6f9a3c2e1b5d7f8a9c3b2e1d4f6a8b9c3d2e1f4a5b6c7d8e9f0a1b2c3d",
  "size": 4567890,
  "cost": 1000000,
  "deletable": false
}
```

### Read Operation:
- Returns the raw file data with appropriate Content-Type headers
- Supports range requests for streaming large files

## Additional Resources

- Complete API specifications: Available at aggregator/publisher endpoints
- Walrus documentation: `/docs/walrus`
- Testnet status: https://docs.wal.app/usage/web-api.html#testnet