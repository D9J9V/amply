'use client';

import { useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Install MiniKit when the app loads
    MiniKit.install();
    console.log('MiniKit installed');
  }, []);

  return <>{children}</>;
}