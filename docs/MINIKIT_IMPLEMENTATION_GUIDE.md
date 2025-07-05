# MiniKit Implementation Guide for World Mini Apps

## Overview
MiniKit is the JavaScript SDK for building World Mini Apps that integrate seamlessly with World App features. This guide provides implementation instructions for using MiniKit in the Amply platform.

## World Mini App Capabilities

MiniKit enables the following client-side actions in World Mini Apps:

### 1. Identity Verification
- **Verify with World ID**: Authenticate users with privacy-preserving proofs
- **Anonymous Actions**: Enable actions without revealing user identity
- **Sybil Resistance**: Ensure one-person-one-action

### 2. Wallet Operations
- **Send Transactions**: Initiate blockchain transactions
- **Sign Messages**: Cryptographic message signing
- **Check Balances**: Query wallet balances

### 3. Social Features
- **Share Content**: Native sharing within World App
- **User Profiles**: Access verified user information
- **Social Graph**: Connect with other verified users

## Implementation for Amply

### Installation
```bash
pnpm add @worldcoin/minikit-js
```

### Basic Setup
```typescript
// app/providers/MiniKitProvider.tsx
'use client';

import { MiniKit } from '@worldcoin/minikit-js';
import { useEffect } from 'react';

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    MiniKit.install();
  }, []);

  return <>{children}</>;
}
```

### Key Features for Amply

#### 1. Verify Human for Content Access
```typescript
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';

async function verifyHumanAccess(contentId: string) {
  const { finalPayload } = await MiniKit.commandsAsync.verify({
    action: 'access-content',
    signal: contentId,
    verification_level: VerificationLevel.Orb,
  });
  
  // Send proof to backend
  await fetch('/api/verify-access', {
    method: 'POST',
    body: JSON.stringify({ proof: finalPayload, contentId }),
  });
}
```

#### 2. Tip Artist with World Wallet
```typescript
async function tipArtist(artistAddress: string, amount: string) {
  const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
    transaction: [{
      to: artistAddress,
      value: amount,
      data: '0x', // Empty data for simple transfer
    }],
  });
  
  return finalPayload.transactionHash;
}
```

#### 3. Share Track in World App
```typescript
async function shareTrack(trackName: string, artistHandle: string) {
  await MiniKit.commandsAsync.share({
    text: `Check out "${trackName}" by ${artistHandle} on Amply!`,
    url: `https://amply.app/artist/${artistHandle}`,
  });
}
```

## Complete Integration Example

For a full Next.js implementation example, see:
`/docs/minikit-js/demo/with-next`

This demo includes:
- Authentication flows
- Transaction handling
- Error management
- TypeScript types
- UI components

## Best Practices

1. **Error Handling**: Always handle MiniKit promise rejections
2. **Loading States**: Show appropriate UI during verification
3. **Fallbacks**: Provide alternative flows for non-World App users
4. **Testing**: Use MiniKit simulator for development

## Environment Configuration

```typescript
// .env.local
NEXT_PUBLIC_APP_ID=app_[your_app_id]
NEXT_PUBLIC_ACTION_ID=action_[your_action_id]
```

## Resources

- **MiniKit Documentation**: Full API reference in `/docs/minikit-js`
- **Demo App**: Complete example in `/docs/minikit-js/demo/with-next`
- **World ID Docs**: Integration details in `/docs/world-id-docs`

This implementation ensures Amply works seamlessly as a World Mini App, providing verified human interactions and native World App features.