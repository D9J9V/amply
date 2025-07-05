# ERC-7730 Clear Signing Implementation Guide

## Overview
ERC-7730 Clear Signing transforms opaque blockchain transactions into human-readable formats, making smart contract interactions transparent and secure. This guide provides implementation instructions for integrating Clear Signing into the Amply platform.

## What is Clear Signing?
Clear Signing converts cryptic hexadecimal transaction data into plain language that users can understand before signing. This prevents scams, builds user confidence, and ensures transparency in all blockchain interactions.

### Key Benefits
- **Transparency**: Shows exactly what users are signing
- **Security**: Prevents phishing and malicious transactions
- **User Trust**: Builds confidence through clarity
- **Compliance**: Meets transparency requirements

## Implementation for Amply

### 1. Transaction Types to Implement

For Amply's music platform, implement Clear Signing for:

#### NFT Master Recordings
```json
{
  "type": "mintMaster",
  "display": "Mint master recording NFT for '[TRACK_NAME]'",
  "fields": {
    "artist": "Artist address",
    "royaltyPercentage": "Royalty %",
    "walrusBlobId": "Content ID"
  }
}
```

#### Tipping Transactions
```json
{
  "type": "tipArtist",
  "display": "Send [AMOUNT] [TOKEN] tip to [ARTIST_NAME]",
  "fields": {
    "recipient": "Artist wallet",
    "amount": "Tip amount",
    "currency": "Token type"
  }
}
```

#### Content Access Verification
```json
{
  "type": "verifyAccess",
  "display": "Verify human access to '[CONTENT_NAME]'",
  "fields": {
    "contentId": "Track ID",
    "worldIdProof": "Verification proof"
  }
}
```

### 2. Metadata File Structure

Create ERC-7730 JSON metadata files for each smart contract:

```json
{
  "context": {
    "contract": {
      "address": "0x...", // Your contract address
      "chainId": 480,     // World Chain ID
      "abi": [...]        // Contract ABI
    }
  },
  "metadata": {
    "owner": "Amply Platform",
    "info": {
      "legalName": "Amply Music Platform",
      "url": "https://amply-seven.vercel.app"
    }
  },
  "display": {
    "functions": {
      "mintMasterNFT": {
        "label": "Mint Master Recording",
        "description": "Create an NFT for your master recording",
        "params": {
          "trackName": {
            "label": "Track Name",
            "type": "string"
          },
          "walrusBlobId": {
            "label": "Audio File ID",
            "type": "bytes32"
          }
        }
      }
    }
  }
}
```

### 3. Integration Steps

#### Step 1: Generate Metadata Files
For each smart contract in your platform:
1. Extract the contract ABI
2. Define human-readable labels for each function
3. Map parameters to descriptive names
4. Include context about expected values

#### Step 2: Validate Metadata
- Ensure JSON follows ERC-7730 schema
- Test with Ledger Live simulator
- Verify all functions have clear descriptions

#### Step 3: Submit to Registry
- Submit validated metadata to the ERC-7730 registry
- Include comprehensive documentation
- Provide example transactions

### 4. Ledger Integration

When users connect their Ledger device:

```javascript
// Example: Clear Signing with Ledger
async function signWithLedger(transaction) {
  // Transaction will be displayed in clear text on device
  const clearDisplay = {
    action: "Mint Master Recording",
    details: {
      "Track": "My New Song",
      "Royalty": "10%",
      "Storage": "Walrus Network"
    }
  };
  
  // User sees this on Ledger screen instead of hex data
  return await ledger.signTransaction(transaction, clearDisplay);
}
```

### 5. Best Practices

1. **Descriptive Labels**: Use clear, non-technical language
2. **Context Matters**: Include units (ETH, %, etc.) in displays
3. **Risk Warnings**: Highlight irreversible actions
4. **Consistency**: Use same terminology across the platform

### 6. Testing Clear Signing

Create test scenarios for:
- NFT minting with clear ownership display
- Tip transactions with recipient verification
- Access verification with World ID integration
- Multi-step transactions with clear flow

### 7. Example Implementation

For Amply's master NFT contract:

```javascript
// Smart Contract Function
function mintMasterNFT(
  string memory trackName,
  bytes32 walrusBlobId,
  uint8 royaltyPercentage
) external;

// ERC-7730 Metadata
{
  "mintMasterNFT": {
    "label": "Create Master Recording NFT",
    "intent": "You are minting an NFT for your track '[trackName]' with [royaltyPercentage]% royalties",
    "risks": ["This action is permanent", "Gas fees apply"]
  }
}
```

## Resources

- **ERC-7730 Standard**: Full specification details
- **Ledger Documentation**: https://developers.ledger.com/docs/clear-signing
- **Registry Submission**: Guidelines for metadata submission
- **Testing Tools**: Simulators and validators

## Hackathon Opportunities

For ETHGlobal Cannes 2025:
- Create ERC-7730 files for Amply's smart contracts
- Build tooling to auto-generate metadata from ABIs
- Implement Clear Signing in the artist dashboard
- Win up to $4,000 in prizes + Ledger Flex device

This implementation ensures all Amply transactions are transparent, building trust between artists and fans while preventing malicious activities.