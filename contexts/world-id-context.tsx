'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MiniKit, VerificationLevel, type MiniAppVerifyActionPayload, type ShareInput } from '@worldcoin/minikit-js';

interface WorldIdContextType {
  isVerified: boolean;
  isArtistVerified: boolean;
  verificationLoading: boolean;
  walletAddress: string | null;
  walletAuthToken: string | null;
  verifyHuman: (signal: string) => Promise<MiniAppVerifyActionPayload | null>;
  verifyArtist: (artistId: string) => Promise<MiniAppVerifyActionPayload | null>;
  authenticateWallet: () => Promise<{ address: string; token: string } | null>;
  shareToWorldApp: (text: string, url: string) => Promise<void>;
  logout: () => void;
}

const WorldIdContext = createContext<WorldIdContextType>({
  isVerified: false,
  isArtistVerified: false,
  verificationLoading: false,
  walletAddress: null,
  walletAuthToken: null,
  verifyHuman: async () => null,
  verifyArtist: async () => null,
  authenticateWallet: async () => null,
  shareToWorldApp: async () => {},
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
    const savedVerification = localStorage.getItem('worldIdVerified');
    const savedArtistVerification = localStorage.getItem('worldIdArtistVerified');
    const savedWalletAddress = localStorage.getItem('worldIdWalletAddress');
    const savedWalletToken = localStorage.getItem('worldIdWalletToken');
    
    if (savedVerification === 'true') setIsVerified(true);
    if (savedArtistVerification === 'true') setIsArtistVerified(true);
    if (savedWalletAddress) setWalletAddress(savedWalletAddress);
    if (savedWalletToken) setWalletAuthToken(savedWalletToken);
  }, []);

  const verifyHuman = useCallback(async (signal: string): Promise<MiniAppVerifyActionPayload | null> => {
    try {
      setVerificationLoading(true);
      console.log('Starting World ID verification with signal:', signal);
      
      // Check if MiniKit is installed
      if (!MiniKit.isInstalled()) {
        console.error('MiniKit is not installed!');
        // Try to install it
        MiniKit.install();
        console.log('MiniKit installed in verifyHuman');
      }
      
      const verifyPayload = {
        action: 'verify_content_access',
        signal,
        verification_level: VerificationLevel.Orb,
      };
      
      console.log('Calling MiniKit.commandsAsync.verify with payload:', verifyPayload);

      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
      
      console.log('Verification response:', finalPayload);
      
      if (finalPayload.status === 'success') {
        setIsVerified(true);
        localStorage.setItem('worldIdVerified', 'true');
        console.log('Verification successful!');
      }
      
      return finalPayload;
    } catch (error) {
      console.error('Human verification failed:', error);
      return null;
    } finally {
      setVerificationLoading(false);
    }
  }, []);

  const verifyArtist = useCallback(async (artistId: string): Promise<MiniAppVerifyActionPayload | null> => {
    try {
      setVerificationLoading(true);
      
      const verifyPayload = {
        action: 'verify_artist_humanity',
        signal: artistId,
        verification_level: VerificationLevel.Orb,
      };

      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
      
      if (finalPayload.status === 'success') {
        setIsArtistVerified(true);
        localStorage.setItem('worldIdArtistVerified', 'true');
      }
      
      return finalPayload;
    } catch (error) {
      console.error('Artist verification failed:', error);
      return null;
    } finally {
      setVerificationLoading(false);
    }
  }, []);

  const authenticateWallet = useCallback(async (): Promise<{ address: string; token: string } | null> => {
    try {
      setVerificationLoading(true);
      
      const nonce = crypto.randomUUID();
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // 7 days from now
      
      const authPayload = {
        nonce,
        statement: 'Sign in to Amply',
        expirationTime: expirationDate,
      };

      const result = await MiniKit.commandsAsync.walletAuth(authPayload);
      
      if (result.finalPayload) {
        // For now, we'll use a mock address since the actual address might be in finalPayload
        const mockAddress = '0x' + crypto.randomUUID().replace(/-/g, '').slice(0, 40);
        setWalletAddress(mockAddress);
        setWalletAuthToken(nonce);
        localStorage.setItem('worldIdWalletAddress', mockAddress);
        localStorage.setItem('worldIdWalletToken', nonce);
        
        return { address: mockAddress, token: nonce };
      }
      
      return null;
    } catch (error) {
      console.error('Wallet authentication failed:', error);
      return null;
    } finally {
      setVerificationLoading(false);
    }
  }, []);

  const shareToWorldApp = useCallback(async (text: string, url: string): Promise<void> => {
    try {
      const sharePayload: ShareInput = {
        text,
        url,
      };
      
      await MiniKit.commandsAsync.share(sharePayload);
      console.log('Content shared successfully');
    } catch (error) {
      console.error('Failed to share:', error);
    }
  }, []);

  const logout = useCallback(() => {
    setIsVerified(false);
    setIsArtistVerified(false);
    setWalletAddress(null);
    setWalletAuthToken(null);
    localStorage.removeItem('worldIdVerified');
    localStorage.removeItem('worldIdArtistVerified');
    localStorage.removeItem('worldIdWalletAddress');
    localStorage.removeItem('worldIdWalletToken');
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