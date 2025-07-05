'use client';

import { useState, useEffect } from 'react';
import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

// ERC-7730 Metadata Types
interface ERC7730Metadata {
  type: string;
  label: string;
  intent: string;
  fields: Record<string, { label: string; type: string; value?: unknown }>;
  risks?: string[];
}

// Mock Ledger Display Component
function LedgerDisplay({ metadata, onApprove, onReject }: { 
  metadata: ERC7730Metadata | null; 
  onApprove: () => void; 
  onReject: () => void; 
}) {
  if (!metadata) return null;

  return (
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
      <div className="border-b border-gray-700 pb-2 mb-3">
        <h3 className="text-white text-lg font-bold">Ledger Nano X</h3>
      </div>
      
      <div className="space-y-2">
        <div className="text-white font-semibold">{metadata.label}</div>
        <div className="text-gray-300 text-xs">{metadata.intent}</div>
        
        <div className="mt-4 space-y-1">
          {Object.entries(metadata.fields).map(([key, field]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-400">{field.label}:</span>
              <span className="text-green-400">{String(field.value || 'N/A')}</span>
            </div>
          ))}
        </div>

        {metadata.risks && (
          <div className="mt-4 text-orange-400 text-xs">
            {metadata.risks.map((risk, i) => (
              <div key={i}>⚠️ {risk}</div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <button 
          onClick={onReject}
          className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Reject (✗)
        </button>
        <button 
          onClick={onApprove}
          className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Approve (✓)
        </button>
      </div>
    </div>
  );
}

export default function LedgerTestPage() {
  const [walletConnectUri, setWalletConnectUri] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<{ model: string; firmware: string; address: string; app: string } | null>(null);
  const [web3wallet, setWeb3wallet] = useState<InstanceType<typeof Web3Wallet> | null>(null);
  const [currentMetadata, setCurrentMetadata] = useState<ERC7730Metadata | null>(null);
  const [transactionLog, setTransactionLog] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  // Add log entry
  const addLog = (message: string) => {
    setTransactionLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 10));
  };

  // Handle session proposal
  const onSessionProposal = async (proposal: { id: number; params: unknown }) => {
    addLog('Session proposal received');
    setConnectionStatus('Pairing...');
    
    try {
      // Auto-approve for demo
      const { id } = proposal;
      const approvedNamespaces = {
        eip155: {
          accounts: ['eip155:480:0x1234567890123456789012345678901234567890'],
          methods: ['eth_sendTransaction', 'personal_sign', 'eth_sign'],
          events: ['accountsChanged', 'chainChanged'],
        }
      };

      await web3wallet?.approveSession({
        id,
        namespaces: approvedNamespaces,
      });

      setIsConnected(true);
      setConnectionStatus('Connected');
      setDeviceInfo({
        model: 'Ledger Nano X',
        firmware: '2.1.0',
        address: '0x1234...7890',
        app: 'Ethereum 1.9.20',
      });
      
      addLog('Ledger device connected successfully');
    } catch (error) {
      addLog(`Error: Failed to approve session - ${error}`);
      setConnectionStatus('Failed');
    }
  };

  // Handle session requests (transactions)
  const onSessionRequest = async (event: { topic: string; params: { request: { method: string; params: unknown[] } }; id: number }) => {
    const { params } = event;
    const { request } = params;
    
    addLog(`Transaction request: ${request.method}`);
    
    // Display transaction on mock Ledger
    if (request.method === 'eth_sendTransaction') {
      // Here you would decode the transaction and show clear signing info
      setCurrentMetadata(getMetadataForTransaction());
    }
  };

  // Handle session deletion
  const onSessionDelete = () => {
    setIsConnected(false);
    setDeviceInfo(null);
    setConnectionStatus('Disconnected');
    addLog('Ledger disconnected');
  };

  // Get ERC-7730 metadata for different transaction types
  const getMetadataForTransaction = (): ERC7730Metadata => {
    // This would normally decode the transaction data
    // For demo, we'll return mock metadata based on the function being called
    return {
      type: 'mintMasterNFT',
      label: 'Create Master Recording NFT',
      intent: "Minting NFT for track 'Summer Vibes' with 10% royalties",
      fields: {
        trackName: { label: 'Track Name', type: 'string', value: 'Summer Vibes' },
        walrusBlobId: { label: 'Audio File ID', type: 'bytes32', value: 'xyz123...' },
        royalty: { label: 'Royalty %', type: 'uint8', value: '10%' },
        gasEstimate: { label: 'Gas Fee', type: 'uint256', value: '0.002 ETH' },
      },
      risks: ['This action is permanent', 'Gas fees will be charged'],
    };
  };

  // Initialize WalletConnect
  useEffect(() => {
    const initWalletConnect = async () => {
      try {
        const core = new Core({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
        });

        const wallet = await Web3Wallet.init({
          core,
          metadata: {
            name: 'Amply Ledger Test',
            description: 'Testing Ledger hardware wallet integration',
            url: 'https://amply-seven.vercel.app',
            icons: ['https://amply-seven.vercel.app/icon.png']
          }
        });

        setWeb3wallet(wallet);
        
        // Set up event listeners
        wallet.on('session_proposal', onSessionProposal);
        wallet.on('session_request', onSessionRequest);
        wallet.on('session_delete', onSessionDelete);
        
        // Generate pairing URI
        const { uri } = await wallet.core.pairing.create();
        setWalletConnectUri(uri);
        
      } catch (error) {
        console.error('Failed to initialize WalletConnect:', error);
        addLog(`Error: Failed to initialize WalletConnect - ${error}`);
      }
    };

    initWalletConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Test different transaction types
  const testMintNFT = () => {
    const metadata: ERC7730Metadata = {
      type: 'mintMasterNFT',
      label: 'Create Master Recording NFT',
      intent: "Minting NFT for track 'Electric Dreams' with 15% royalties",
      fields: {
        trackName: { label: 'Track Name', type: 'string', value: 'Electric Dreams' },
        walrusBlobId: { label: 'Audio File ID', type: 'bytes32', value: 'abc789...' },
        royalty: { label: 'Royalty %', type: 'uint8', value: '15%' },
        gasEstimate: { label: 'Gas Fee', type: 'uint256', value: '0.003 ETH' },
      },
      risks: ['This action is permanent', 'You will own this NFT'],
    };
    setCurrentMetadata(metadata);
    addLog('Simulating NFT mint transaction');
  };

  const testTipping = () => {
    const metadata: ERC7730Metadata = {
      type: 'tipArtist',
      label: 'Send Tip to Artist',
      intent: "Send 0.05 ETH tip to artist 'CryptoBeats'",
      fields: {
        recipient: { label: 'Artist', type: 'address', value: 'CryptoBeats' },
        amount: { label: 'Tip Amount', type: 'uint256', value: '0.05 ETH' },
        currency: { label: 'Token', type: 'string', value: 'ETH' },
      },
      risks: ['This transaction cannot be reversed'],
    };
    setCurrentMetadata(metadata);
    addLog('Simulating tip transaction');
  };

  const testAccessVerification = () => {
    const metadata: ERC7730Metadata = {
      type: 'verifyAccess',
      label: 'Verify Human Access',
      intent: "Verify human access to 'Midnight Sessions EP'",
      fields: {
        contentId: { label: 'Content', type: 'string', value: 'Midnight Sessions EP' },
        worldIdProof: { label: 'Verification', type: 'bytes', value: 'Proof: 0xabc...' },
        timestamp: { label: 'Time', type: 'uint256', value: new Date().toLocaleString() },
      },
    };
    setCurrentMetadata(metadata);
    addLog('Simulating access verification');
  };

  const handleApprove = () => {
    addLog(`Transaction approved: ${currentMetadata?.type}`);
    setCurrentMetadata(null);
  };

  const handleReject = () => {
    addLog(`Transaction rejected: ${currentMetadata?.type}`);
    setCurrentMetadata(null);
  };

  const simulateReconnect = () => {
    if (isConnected) {
      onSessionDelete();
      setTimeout(() => {
        setIsConnected(true);
        setConnectionStatus('Reconnected');
        setDeviceInfo({
          model: 'Ledger Nano X',
          firmware: '2.1.0',
          address: '0x1234...7890',
          app: 'Ethereum 1.9.20',
        });
        addLog('Ledger reconnected successfully');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Ledger Hardware Wallet & ERC-7730 Clear Signing Test
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* WalletConnect Setup */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              1. WalletConnect Setup
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Connection Status
                </label>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-gray-900 dark:text-white">{connectionStatus}</span>
                </div>
              </div>

              {!isConnected && walletConnectUri && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WalletConnect URI
                  </label>
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs break-all">
                    {walletConnectUri.substring(0, 50)}...
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use this URI to connect your Ledger via WalletConnect
                  </p>
                </div>
              )}

              {deviceInfo && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Connected Device Info
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Model:</span>
                      <span className="text-gray-900 dark:text-white">{deviceInfo.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Firmware:</span>
                      <span className="text-gray-900 dark:text-white">{deviceInfo.firmware}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Address:</span>
                      <span className="text-gray-900 dark:text-white font-mono">{deviceInfo.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">App:</span>
                      <span className="text-gray-900 dark:text-white">{deviceInfo.app}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={simulateReconnect}
                disabled={!isConnected}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Test Reconnection Flow
              </button>
            </div>
          </div>

          {/* Mock Ledger Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              2. Ledger Device Display
            </h2>
            
            <LedgerDisplay 
              metadata={currentMetadata} 
              onApprove={handleApprove}
              onReject={handleReject}
            />

            {!currentMetadata && (
              <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Ledger display will appear here when signing transactions
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ERC-7730 Transaction Tests */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            3. ERC-7730 Transaction Tests
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={testMintNFT}
              className="p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            >
              <h3 className="font-semibold text-purple-600 dark:text-purple-400">
                NFT Minting
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Test minting a master recording NFT with clear signing
              </p>
            </button>

            <button
              onClick={testTipping}
              className="p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              <h3 className="font-semibold text-green-600 dark:text-green-400">
                Artist Tipping
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Test sending a tip with transparent amount display
              </p>
            </button>

            <button
              onClick={testAccessVerification}
              className="p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                Access Verification
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Test World ID verification with clear intent
              </p>
            </button>
          </div>
        </div>

        {/* Transaction Log */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            4. Transaction Log
          </h2>
          
          <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 h-48 overflow-y-auto">
            {transactionLog.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Transaction history will appear here...
              </p>
            ) : (
              <div className="space-y-1">
                {transactionLog.map((log, index) => (
                  <div key={index} className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ERC-7730 Metadata Examples */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            5. ERC-7730 Metadata Examples
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                NFT Minting Metadata
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
{JSON.stringify({
  mintMasterNFT: {
    label: "Create Master Recording NFT",
    intent: "Minting NFT for track '[trackName]' with [royalty]% royalties",
    fields: {
      trackName: { label: "Track Name", type: "string" },
      walrusBlobId: { label: "Audio File ID", type: "bytes32" },
      royalty: { label: "Royalty %", type: "uint8" }
    },
    risks: ["This action is permanent", "Gas fees will be charged"]
  }
}, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Tipping Metadata
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs overflow-x-auto">
{JSON.stringify({
  tipArtist: {
    label: "Send Tip to Artist",
    intent: "Send [amount] [token] tip to [artistName]",
    fields: {
      recipient: { label: "Artist Wallet", type: "address" },
      amount: { label: "Tip Amount", type: "uint256" },
      currency: { label: "Token Type", type: "string" }
    }
  }
}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}