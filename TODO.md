# Amply Development ToDo

## Overview
Three-stage development plan based on World ID/MiniKit, Walrus, and Ledger integration requirements for ETHGlobal Cannes 2025.

---

## Stage 1: Build Test Components 🧪
*Implement isolated test components using actual SDK methods and API endpoints*

### 1.1 World ID / MiniKit Integration (`/test/world`)

#### Setup & Configuration
- [ ] Install MiniKit: `pnpm add @worldcoin/minikit-js`
- [ ] Create MiniKitProvider with `MiniKit.install()`
- [ ] Configure environment variables:
  ```env
  NEXT_PUBLIC_APP_ID=app_[staging_id]
  NEXT_PUBLIC_ACTION_ID=amply_content_access
  ```

#### Core Verification Components
- [ ] **Human Verification Test**
  - [ ] Implement `MiniKit.commandsAsync.verify()` with:
    - Action: `'access-content'`
    - Signal: Track/Content ID
    - Verification level: `VerificationLevel.Orb`
  - [ ] Display proof payload and nullifier hash
  - [ ] Test error handling for unverified users

- [ ] **Wallet Authentication Test**
  - [ ] Generate nonce with `crypto.randomUUID()`
  - [ ] Implement `MiniKit.commands.walletAuth()` with:
    - Statement: "Sign in to Amply as artist"
    - Expiration: 7 days
  - [ ] Store session token after verification

#### Payment & Transaction Components
- [ ] **Tipping Flow Test**
  - [ ] Implement `MiniKit.commandsAsync.pay()` for direct tips
  - [ ] Test `sendTransaction()` with tip contract:
    ```typescript
    {
      address: TIP_CONTRACT_ADDRESS,
      abi: TIP_ABI,
      functionName: 'tipArtist',
      args: [artistAddress, amount],
      value: tipAmount
    }
    ```
  - [ ] Handle transaction confirmation events

- [ ] **Social Sharing Test**
  - [ ] Implement `MiniKit.commandsAsync.share()` with:
    - Text: Track title and artist
    - URL: Track deep link
  - [ ] Test share completion callbacks

### 1.2 Walrus Storage Tests (`/test/walrus`)

#### API Integration Components
- [ ] **Enhanced Upload Component**
  - [ ] Update to use real XMLHttpRequest for progress:
    ```javascript
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      const progress = (e.loaded / e.total) * 100;
    };
    ```
  - [ ] Implement two-phase upload:
    1. Draft: `PUT /v1/blobs?deletable=true`
    2. Permanent: `PUT /v1/blobs`
  - [ ] Parse response for blob metadata:
    ```json
    {
      "newlyCreated": {
        "blobObject": {
          "id": "0x...",
          "blobId": "...",
          "size": 4567890
        }
      }
    }
    ```

- [ ] **Metadata Storage Test**
  - [ ] Create JSON metadata for tracks:
    ```json
    {
      "title": "Track Name",
      "artist": "Artist Name",
      "duration": 180,
      "blobId": "xyz123...",
      "worldIdVerified": true
    }
    ```
  - [ ] Upload metadata as separate blob
  - [ ] Link metadata blob to audio blob

- [ ] **Streaming Playback Test**
  - [ ] Implement audio element with Walrus URL:
    ```javascript
    const audioUrl = `${AGGREGATOR}/v1/blobs/${blobId}`;
    ```
  - [ ] Test range requests for large files
  - [ ] Add buffering indicators

### 1.3 Ledger & ERC-7730 Tests (`/test/ledger`)

#### Hardware Wallet Integration
- [ ] **WalletConnect Setup**
  - [ ] Initialize WalletConnect v2
  - [ ] Implement Ledger device pairing
  - [ ] Display connected device info
  - [ ] Test reconnection flows

#### Clear Signing Implementation
- [ ] **ERC-7730 Metadata Creation**
  - [ ] Create metadata for NFT minting:
    ```json
    {
      "mintMasterNFT": {
        "label": "Create Master Recording NFT",
        "intent": "Minting NFT for track '[trackName]' with [royalty]% royalties",
        "fields": {
          "trackName": { "label": "Track Name", "type": "string" },
          "walrusBlobId": { "label": "Audio File ID", "type": "bytes32" },
          "royalty": { "label": "Royalty %", "type": "uint8" }
        }
      }
    }
    ```
  - [ ] Create metadata for tipping
  - [ ] Create metadata for access verification

- [ ] **Transaction Display Test**
  - [ ] Mock Ledger screen display
  - [ ] Show human-readable transaction details
  - [ ] Test approval/rejection flows

### 1.4 Smart Contract Interaction Tests

#### Contract Deployment
- [ ] **Deploy Test Contracts to World Chain (480)**
  - [ ] Master NFT Contract (ERC-721) with:
    - World ID verification modifier
    - Walrus blob ID storage
    - Royalty configuration
  - [ ] Tipping Contract with:
    - Direct artist payments
    - Fee distribution logic
    - Event emission for tips
  - [ ] Access Control Contract with:
    - World ID proof verification
    - Content access logging

#### Integration Tests
- [ ] **NFT Minting Flow**
  - [ ] Call contract with Walrus blob ID
  - [ ] Verify World ID before minting
  - [ ] Test metadata URI generation

- [ ] **Tipping Flow**
  - [ ] Test ETH tips via contract
  - [ ] Verify recipient receives funds
  - [ ] Check event logs

---

## Stage 2: Scaffold Frontend 🎨
*Build UI components with MiniKit integration and proper data structures*

### 2.1 MiniKit Provider Setup
- [ ] **Root Layout Configuration**
  ```typescript
  // app/layout.tsx
  <MiniKitProvider>
    <SessionProvider>
      {children}
    </SessionProvider>
  </MiniKitProvider>
  ```
- [ ] Add event listeners for MiniKit responses
- [ ] Setup error boundary for SDK failures

### 2.2 Authentication Flow
- [ ] **World ID Login Component**
  - [ ] "Sign in with World ID" button
  - [ ] Handle `walletAuth` response
  - [ ] Store wallet address and session
  - [ ] Display verification badge

### 2.3 Artist Dashboard (`/artist/[handle]/dashboard`)
- [ ] **Real Impression Analytics**
  - [ ] Query verified access events
  - [ ] Display human-only metrics
  - [ ] Show tip revenue charts
  - [ ] Geographic distribution (anonymized)

### 2.4 Upload Interface (`/artist/[handle]/upload`)
- [ ] **Multi-Step Upload Flow**
  1. File selection with preview
  2. Metadata entry form
  3. Walrus upload with progress
  4. NFT minting option
  5. Publish confirmation

- [ ] **Upload State Management**
  ```typescript
  interface UploadState {
    file: File;
    metadata: TrackMetadata;
    walrusBlobId?: string;
    nftTokenId?: string;
    status: 'draft' | 'uploading' | 'minting' | 'published';
  }
  ```

### 2.5 Music Player Component
- [ ] **Global Player with Walrus Streaming**
  - [ ] Queue management
  - [ ] Walrus blob URL handling
  - [ ] Offline caching strategy
  - [ ] Skip protection for verified plays

### 2.6 Tipping Interface
- [ ] **Quick Tip Component**
  - [ ] Preset amounts (0.01, 0.05, 0.1 ETH)
  - [ ] Custom amount input
  - [ ] MiniKit payment flow
  - [ ] Success animations

---

## Stage 3: Integration 🔧
*Connect all components with proper verification and data flow*

### 3.1 World ID Integration
- [ ] **Verification Middleware**
  ```typescript
  async function requireWorldID(req: Request) {
    const proof = req.headers.get('X-World-Proof');
    // Verify proof on-chain or via API
  }
  ```
- [ ] Add to all protected routes
- [ ] Cache verification status

### 3.2 Content Access Flow
- [ ] **Verified Play Tracking**
  1. User clicks play
  2. Trigger World ID verification
  3. Log access on-chain
  4. Stream from Walrus
  5. Update impression count

### 3.3 NFT Minting Flow
- [ ] **Complete Minting Process**
  1. Upload to Walrus (permanent)
  2. Create metadata JSON
  3. Connect Ledger wallet
  4. Display clear signing info
  5. Mint NFT with blob ID
  6. Update artist inventory

### 3.4 API Routes
- [ ] **Verification Endpoint**
  ```typescript
  // app/api/verify/route.ts
  POST /api/verify
  - Validate World ID proof
  - Check nullifier hash
  - Return session token
  ```

- [ ] **Upload Coordination**
  ```typescript
  // app/api/upload/complete/route.ts
  POST /api/upload/complete
  - Verify Walrus blob exists
  - Create database entry
  - Trigger NFT minting
  ```

### 3.5 Production Readiness
- [ ] **Environment Configuration**
  - [ ] Switch to World Chain mainnet (480)
  - [ ] Use Walrus mainnet URLs
  - [ ] Production World ID app
  - [ ] Ledger Live integration

- [ ] **Testing & Validation**
  - [ ] End-to-end user flows
  - [ ] Load testing with mock users
  - [ ] Security audit checklist
  - [ ] Gas optimization

---

## Hackathon Requirements Checklist

### Mini App Prize ($17,000)
- [ ] ✅ Uses MiniKit SDK commands:
  - [ ] `verify()` for access control
  - [ ] `pay()` or `sendTransaction()` for tipping
  - [ ] `share()` for social features
  - [ ] `walletAuth()` for authentication
- [ ] ✅ Deploys to World Chain
- [ ] ✅ No gambling/chance elements
- [ ] ✅ Proof validation in backend

### Walrus Prize ($10,000)
- [ ] ✅ Uploads audio/video to Walrus
- [ ] ✅ Retrieves and streams content
- [ ] ✅ Solves real problem (permanent music storage)
- [ ] ✅ New application (not existing)

### Clear Signing Prize ($4,000)
- [ ] ✅ Implements ERC-7730 standard
- [ ] ✅ Creates metadata for all transactions
- [ ] ✅ Shows human-readable signing
- [ ] ✅ Integrates with Ledger

---

## Critical Path Items
1. **MiniKit Integration** - Required for main prize
2. **Walrus Upload/Stream** - Core functionality
3. **World ID Verification** - Unique value prop
4. **Basic UI** - Demo-able product
5. **Smart Contracts** - On World Chain

Focus on these five items for MVP!