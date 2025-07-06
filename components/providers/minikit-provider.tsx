'use client';

import { MiniKitProvider as MiniKitProviderCore } from '@worldcoin/minikit-js/minikit-provider';
import type { ReactNode } from 'react';

export function MiniKitProvider({ children }: { children: ReactNode }) {
  return <MiniKitProviderCore>{children}</MiniKitProviderCore>;
}