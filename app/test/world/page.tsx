'use client';

import { useState, useEffect } from 'react';
import { MiniKit, VerificationLevel, Tokens, type VerifyCommandInput, type PayCommandInput, type WalletAuthInput, type MiniAppVerifyActionPayload } from '@worldcoin/minikit-js';

export default function WorldTestPage() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [verificationResult, setVerificationResult] = useState<MiniAppVerifyActionPayload | null>(null);
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [authResult, setAuthResult] = useState<{ nonce: string; expirationTime: string } | null>(null);
  const [tipStatus, setTipStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tipResult, setTipResult] = useState<{ status: string } | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  // Test data
  const contentId = 'test-track-123';
  const artistAddress = '0x1234567890123456789012345678901234567890';
  const tipAmount = '0.001'; // ETH

  useEffect(() => {
    MiniKit.install();
    setIsInstalled(true);
  }, []);

  // 1. Human Verification Test
  const handleVerification = async () => {
    try {
      setVerificationStatus('loading');
      setError('');
      
      const verifyPayload: VerifyCommandInput = {
        action: 'access-content',
        signal: contentId,
        verification_level: VerificationLevel.Orb,
      };

      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
      
      setVerificationResult(finalPayload);
      setVerificationStatus('success');
      
      // In a real app, send this proof to backend
      console.log('Verification proof:', finalPayload);
      // Note: nullifier_hash is only available on success
      if (finalPayload.status === 'success') {
        console.log('Nullifier hash:', finalPayload.nullifier_hash);
      }
    } catch (err) {
      setError((err as Error).message || 'Verification failed');
      setVerificationStatus('error');
    }
  };

  // 2. Wallet Authentication Test
  const handleWalletAuth = async () => {
    try {
      setAuthStatus('loading');
      setError('');
      
      const nonce = crypto.randomUUID();
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // 7 days from now
      
      const authPayload: WalletAuthInput = {
        nonce,
        statement: 'Sign in to Amply as artist',
        expirationTime: expirationDate,
      };

      const result = await MiniKit.commandsAsync.walletAuth(authPayload);
      
      setAuthResult({
        ...result,
        nonce,
        expirationTime: expirationDate.toISOString()
      });
      setAuthStatus('success');
      
      // In a real app, store session token
      console.log('Auth successful:', result);
    } catch (err) {
      setError((err as Error).message || 'Authentication failed');
      setAuthStatus('error');
    }
  };

  // 3. Tipping Flow Test
  const handleTipArtist = async () => {
    try {
      setTipStatus('loading');
      setError('');
      
      // Convert ETH to wei
      const tipAmountWei = BigInt(parseFloat(tipAmount) * 1e18).toString();
      
      // Method 1: Direct payment
      const payPayload: PayCommandInput = {
        reference: `tip-${Date.now()}`, // Unique reference ID
        to: artistAddress,
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tipAmountWei,
          },
        ],
        description: 'Tip for amazing music!',
      };

      const { finalPayload } = await MiniKit.commandsAsync.pay(payPayload);
      
      setTipResult(finalPayload);
      setTipStatus('success');
      
      console.log('Tip transaction:', finalPayload);
    } catch (err) {
      setError((err as Error).message || 'Tipping failed');
      setTipStatus('error');
    }
  };

  // Alternative tip method using sendTransaction (commented out for demo)
  const handleTipWithContract = async () => {
    try {
      setTipStatus('loading');
      setError('');
      
      // This would be used with a tip contract
      const tipAmountWei = BigInt(parseFloat(tipAmount) * 1e18).toString();
      
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address: artistAddress,
          abi: [],
          functionName: 'transfer',
          args: [],
          value: tipAmountWei,
        }],
      });
      
      setTipResult(finalPayload);
      setTipStatus('success');
    } catch (err) {
      setError((err as Error).message || 'Transaction failed');
      setTipStatus('error');
    }
  };

  // 4. Social Sharing Test
  const handleShare = async () => {
    try {
      setShareStatus('loading');
      setError('');
      
      await MiniKit.commandsAsync.share({
        text: 'Check out "Test Track" by Test Artist on Amply!',
        url: `https://amply-seven.vercel.app/track/${contentId}`,
      });
      
      setShareStatus('success');
      console.log('Share completed');
    } catch (err) {
      setError((err as Error).message || 'Sharing failed');
      setShareStatus('error');
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          World ID / MiniKit Integration Test
        </h1>

        {/* MiniKit Status */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              MiniKit {isInstalled ? 'Installed' : 'Not Installed'}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* 1. Human Verification Test */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              1. Human Verification Test
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Verify human access to content using World ID with Orb verification level.
            </p>
            
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                <strong>Action:</strong> access-content<br />
                <strong>Signal:</strong> {contentId}<br />
                <strong>Level:</strong> Orb
              </p>
            </div>

            <button
              onClick={handleVerification}
              disabled={verificationStatus === 'loading'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {verificationStatus === 'loading' ? 'Verifying...' : 'Verify Human'}
            </button>

            {verificationResult && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Verification Result:</h3>
                <pre className="text-xs overflow-x-auto text-gray-600 dark:text-gray-400">
                  {JSON.stringify(verificationResult, null, 2)}
                </pre>
                {verificationResult.status === 'success' && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Nullifier Hash:</strong> {verificationResult.nullifier_hash}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Wallet Authentication Test */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              2. Wallet Authentication Test
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Authenticate artist wallet with 7-day session expiration.
            </p>

            <button
              onClick={handleWalletAuth}
              disabled={authStatus === 'loading'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {authStatus === 'loading' ? 'Authenticating...' : 'Authenticate Wallet'}
            </button>

            {authResult && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Auth Result:</h3>
                <pre className="text-xs overflow-x-auto text-gray-600 dark:text-gray-400">
                  {JSON.stringify(authResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* 3. Tipping Flow Test */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              3. Tipping Flow Test
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Send a tip to an artist using World Wallet.
            </p>
            
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                <strong>Artist:</strong> {artistAddress}<br />
                <strong>Amount:</strong> {tipAmount} ETH
              </p>
            </div>

            <div className="space-x-2">
              <button
                onClick={handleTipArtist}
                disabled={tipStatus === 'loading'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {tipStatus === 'loading' ? 'Processing...' : 'Send Tip (Pay)'}
              </button>
              
              <button
                onClick={handleTipWithContract}
                disabled={tipStatus === 'loading'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {tipStatus === 'loading' ? 'Processing...' : 'Send Tip (Transaction)'}
              </button>
            </div>

            {tipResult && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Transaction Result:</h3>
                <pre className="text-xs overflow-x-auto text-gray-600 dark:text-gray-400">
                  {JSON.stringify(tipResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* 4. Social Sharing Test */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              4. Social Sharing Test
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Share track within World App with deep linking.
            </p>

            <button
              onClick={handleShare}
              disabled={shareStatus === 'loading'}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {shareStatus === 'loading' ? 'Sharing...' : 'Share Track'}
            </button>

            {shareStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-400">Track shared successfully!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}