'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MiniKit, VerificationLevel, ResponseEvent, type ISuccessResult, type ShareInput } from '@worldcoin/minikit-js';

interface WorldIdContextType {
  isVerified: boolean;
  isArtistVerified: boolean;
  verificationLoading: boolean;
  walletAddress: string | null;
  walletAuthToken: string | null;
  verifyHuman: (signal: string) => void;
  verifyArtist: (artistId: string) => void;
  authenticateWallet: () => void;
  shareToWorldApp: (text: string, url: string) => void;
  logout: () => void;
}

const WorldIdContext = createContext<WorldIdContextType>({
  isVerified: false,
  isArtistVerified: false,
  verificationLoading: false,
  walletAddress: null,
  walletAuthToken: null,
  verifyHuman: () => {},
  verifyArtist: () => {},
  authenticateWallet: () => {},
  shareToWorldApp: () => {},
  logout: () => {},
});

export const useWorldId = () => {
  const context = useContext(WorldIdContext);
  if (!context) {
    throw new Error('useWorldId must be used within a WorldIdProvider');
  }
  return context;
};

export function WorldIdProvider({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [isArtistVerified, setIsArtistVerified] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletAuthToken, setWalletAuthToken] = useState<string | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      try {
        const savedVerification = localStorage.getItem('worldIdVerified');
        const savedArtistVerification = localStorage.getItem('worldIdArtistVerified');
        const savedWalletAddress = localStorage.getItem('worldIdWalletAddress');
        const savedWalletToken = localStorage.getItem('worldIdWalletToken');
        
        if (savedVerification === 'true') setIsVerified(true);
        if (savedArtistVerification === 'true') setIsArtistVerified(true);
        if (savedWalletAddress) setWalletAddress(savedWalletAddress);
        if (savedWalletToken) setWalletAuthToken(savedWalletToken);
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Subscribe to MiniKit events
  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.warn('MiniKit is not installed');
      return;
    }

    // Subscribe to verify events
    MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, async (payload) => {
      console.log('MiniAppVerifyAction response:', payload);
      setVerificationLoading(false);
      
      if (payload.status === 'success') {
        // For now, we'll set both verified states to true on any successful verification
        // In a real app, you'd track which verification was requested
        setIsVerified(true);
        setIsArtistVerified(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('worldIdVerified', 'true');
          localStorage.setItem('worldIdArtistVerified', 'true');
        }
      }
    });

    // Subscribe to wallet auth events
    MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, async (payload) => {
      console.log('MiniAppWalletAuth response:', payload);
      setVerificationLoading(false);
      
      if (payload.status === 'success') {
        const mockAddress = '0x' + Math.random().toString(36).substring(2, 42);
        setWalletAddress(mockAddress);
        setWalletAuthToken(payload.message || 'authenticated');
        if (typeof window !== 'undefined') {
          localStorage.setItem('worldIdWalletAddress', mockAddress);
          localStorage.setItem('worldIdWalletToken', payload.message || 'authenticated');
        }
      }
    });

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
      MiniKit.unsubscribe(ResponseEvent.MiniAppWalletAuth);
    };
  }, []);

  const verifyHuman = useCallback((signal: string): void => {
    console.log('Starting World ID verification with signal:', signal);
    
    // Check if MiniKit is installed
    if (!MiniKit.isInstalled()) {
      console.error('MiniKit is not installed!');
      // For development, simulate successful verification
      if (process.env.NODE_ENV === 'development') {
        setIsVerified(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('worldIdVerified', 'true');
        }
      }
      return;
    }
    
    setVerificationLoading(true);
    
    const verifyPayload = {
      action: 'verify_content_access',
      signal,
      verification_level: VerificationLevel.Orb,
    };
    
    console.log('Calling MiniKit.commands.verify with payload:', verifyPayload);
    
    // Send the verify command
    MiniKit.commands.verify(verifyPayload);
  }, []);

  const verifyArtist = useCallback((artistId: string): void => {
    // Check if MiniKit is installed
    if (!MiniKit.isInstalled()) {
      console.error('MiniKit is not installed!');
      if (process.env.NODE_ENV === 'development') {
        setIsArtistVerified(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('worldIdArtistVerified', 'true');
        }
      }
      return;
    }
    
    setVerificationLoading(true);
    
    const verifyPayload = {
      action: 'verify_artist_humanity',
      signal: artistId,
      verification_level: VerificationLevel.Orb,
    };

    MiniKit.commands.verify(verifyPayload);
  }, []);

  const authenticateWallet = useCallback((): void => {
    // Check if MiniKit is installed
    if (!MiniKit.isInstalled()) {
      console.error('MiniKit is not installed!');
      if (process.env.NODE_ENV === 'development') {
        const mockAddress = '0x' + Math.random().toString(36).substring(2, 42);
        const nonce = Math.random().toString(36).substring(2, 15);
        setWalletAddress(mockAddress);
        setWalletAuthToken(nonce);
        if (typeof window !== 'undefined') {
          localStorage.setItem('worldIdWalletAddress', mockAddress);
          localStorage.setItem('worldIdWalletToken', nonce);
        }
      }
      return;
    }
    
    setVerificationLoading(true);
    
    const nonce = Math.random().toString(36).substring(2, 15);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 days from now
    
    const authPayload = {
      nonce,
      statement: 'Sign in to Amply',
      expirationTime: expirationDate,
    };

    MiniKit.commands.walletAuth(authPayload);
  }, []);

  const shareToWorldApp = useCallback((text: string, url: string): void => {
    // Check if MiniKit is installed
    if (!MiniKit.isInstalled()) {
      console.error('MiniKit is not installed!');
      // In development, use native share API or console log
      if (navigator.share) {
        navigator.share({ text, url }).catch(console.error);
      } else {
        console.log('Share content:', { text, url });
      }
      return;
    }
    
    const sharePayload: ShareInput = {
      text,
      url,
    };
    
    MiniKit.commands.share(sharePayload);
    console.log('Share command sent');
  }, []);

  const logout = useCallback(() => {
    setIsVerified(false);
    setIsArtistVerified(false);
    setWalletAddress(null);
    setWalletAuthToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('worldIdVerified');
      localStorage.removeItem('worldIdArtistVerified');
      localStorage.removeItem('worldIdWalletAddress');
      localStorage.removeItem('worldIdWalletToken');
    }
  }, []);

  return (
    <WorldIdContext.Provider
      value={{
        isVerified,
        isArtistVerified,
        verificationLoading,
        walletAddress,
        walletAuthToken,
        verifyHuman,
        verifyArtist,
        authenticateWallet,
        shareToWorldApp,
        logout,
      }}
    >
      {children}
    </WorldIdContext.Provider>
  );
}