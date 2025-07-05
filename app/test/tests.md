# Amply Test Pages Guide

This guide explains what to expect when testing each sponsor integration demo page.

## 🌐 World ID/MiniKit Demo (`/test/world`)

### What You'll See:
- **MiniKit Status**: Green indicator if MiniKit is installed, red if not
- **Four Test Sections**: Human Verification, Wallet Authentication, Tipping Flow, and Social Sharing

### Expected Behavior:

#### 1. Human Verification Test
- **Click "Verify Human"** → Opens World App verification flow
- **Expected**: If you have World ID verified, you'll see:
  - Success message with proof data
  - Nullifier hash displayed
  - JSON response showing verification details
- **Without World ID**: Error message about verification requirement

#### 2. Wallet Authentication
- **Click "Authenticate Wallet"** → Prompts to sign in with World App
- **Expected**: 
  - Nonce generation (UUID displayed)
  - Authentication request with 7-day expiration
  - Success shows wallet address and session token
- **Use Case**: This would store session for artist dashboard access

#### 3. Tipping Flow
- **Two Options**: Direct WLD payment or Smart Contract tip
- **Expected for Direct Payment**:
  - Opens World App payment screen
  - Shows 0.1 WLD default amount
  - Reference ID for tracking
- **Expected for Contract**:
  - Transaction request in World App
  - Shows tip amount in ETH
  - Contract interaction details

#### 4. Social Sharing
- **Click "Share Track"** → Opens World App share dialog
- **Expected**:
  - Pre-filled text about the track
  - Deep link to track page
  - Success confirmation when shared

## 💾 Walrus Storage Demo (`/test/walrus`)

### What You'll See:
- **Configuration Display**: Shows Walrus testnet endpoints
- **Upload Section**: File picker with phase indicators
- **Blob List**: Shows uploaded files with metadata

### Expected Behavior:

#### 1. File Upload
- **Select any audio/video file** (< 25MB recommended for testing)
- **Three Upload Phases**:
  1. **Draft Upload** (Yellow): Temporary storage with progress bar
  2. **Permanent Upload** (Blue): Final storage with progress bar
  3. **Metadata Upload** (Green): JSON metadata storage
- **Expected**: All three phases complete with progress bars reaching 100%

#### 2. Metadata Creation
- **Automatic Extraction**: Duration calculated from audio files
- **Fields Stored**:
  - Title: "Test Track"
  - Artist: "Test Artist"
  - Duration in seconds
  - Blob ID reference
  - World ID verification status

#### 3. Streaming Playback
- **Click Play** on any uploaded blob
- **Expected**:
  - Audio/video starts streaming immediately
  - Buffering indicator if needed
  - Playback controls work normally
- **Note**: Supports range requests for seeking in large files

### Test Results Panel
- Shows checkmarks for completed features
- Updates automatically as you test each function

## 🔐 Ledger/ERC-7730 Demo (`/test/ledger`)

### What You'll See:
- **Connection Section**: WalletConnect pairing interface
- **Device Info**: Mock display of connected Ledger details
- **Transaction Tests**: Three transaction type buttons
- **Mock Ledger Display**: Simulated device screen

### Expected Behavior:

#### 1. Wallet Connection
- **Click "Connect Ledger"** → Generates WalletConnect URI
- **In Real Use**: You'd scan this with Ledger Live
- **Demo Shows**: Mock connection with sample device info
  - Ledger Nano X
  - Firmware version
  - Ethereum address
  - App version

#### 2. Transaction Testing

##### NFT Minting Transaction
- **Click "Test NFT Minting"**
- **Ledger Display Shows**:
  - "Create Master Recording NFT"
  - Track Name: "My Original Song"
  - Audio File ID (shortened)
  - Royalty: 10%
  - Risk Warning about permanence

##### Tipping Transaction
- **Click "Test Tipping"**
- **Ledger Display Shows**:
  - "Send Artist Tip"
  - Recipient address (shortened)
  - Amount: 0.05 ETH
  - Currency clearly displayed
  - Artist name

##### Access Verification
- **Click "Test Access Verification"**
- **Ledger Display Shows**:
  - "Verify Content Access"
  - Content ID
  - World ID proof (shortened)
  - Timestamp
  - Low risk indicator

#### 3. Approval Flow
- **Each transaction shows**:
  - Mock Ledger screen with transaction details
  - Approve/Reject buttons
  - Clear human-readable information
- **On Approve**: Transaction logged with timestamp
- **On Reject**: Transaction cancelled and logged

### Transaction Log
- Shows all transaction attempts
- Includes type, status, and timestamp
- Useful for debugging integration

## 🎯 Testing Tips

1. **Start with World ID**: Test human verification first as it's used by other features
2. **Use Small Files**: For Walrus, start with files under 5MB for faster testing
3. **Check Console**: All demos log detailed information for debugging
4. **Dark Mode**: All pages support dark mode - try toggling your system theme
5. **Error States**: Try operations without prerequisites to see error handling

## ⚠️ Common Issues

- **MiniKit Not Installed**: Install World App and enable developer mode
- **CORS Errors**: Walrus uses a proxy at `/api/walrus-proxy` to handle browser restrictions
- **Large Files**: Walrus uploads may timeout for very large files (>50MB)
- **WalletConnect**: The Ledger demo shows mock data - real pairing requires Ledger Live

## 🚀 Next Steps

After testing these demos, the components can be integrated into the main Amply application:
- World ID verification for all content access
- Walrus storage for permanent, decentralized media hosting
- Ledger integration for secure NFT ownership transfers