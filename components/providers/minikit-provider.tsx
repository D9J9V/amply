'use client';

import { useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { WorldIdProvider } from '@/contexts/world-id-context';

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Install MiniKit when the app loads
    MiniKit.install();
  }, []);

  return <WorldIdProvider>{children}</WorldIdProvider>;
}