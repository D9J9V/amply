'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Users, Music, TrendingUp, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import WalrusContentPlayer from '@/components/walrus-content-player';
import { walrusStorage, type ArtistContent } from '@/lib/services/walrus-storage';

export default function WalrusVaultDemo() {
  const [artistContent, setArtistContent] = useState<ArtistContent[]>([]);
  const [isSupporter, setIsSupporter] = useState(false);
  const [supportTier, setSupportTier] = useState(0);
  const demoArtistId = 'demo-artist-id';
  const demoUserId = 'demo-user-id';

  useEffect(() => {
    loadArtistContent();
  }, []);

  const loadArtistContent = async () => {
    // Load demo content - in production, this would come from the database
    const demoContent: ArtistContent[] = [
      {
        id: 'demo-1',
        artistId: demoArtistId,
        walrusBlobId: 'walrus-1',
        title: 'Summer Vibes (Public)',
        description: 'A chill summer track for everyone',
        contentType: 'track',
        isPrivate: false,
        metadata: { duration: 210, artist: 'Demo Artist', genre: 'Chill' },
        playCount: 1234,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'demo-2',
        artistId: demoArtistId,
        walrusBlobId: 'walrus-2',
        title: 'Exclusive Beat (Supporters Only)',
        description: 'Special track for my supporters',
        contentType: 'track',
        isPrivate: true,
        metadata: { duration: 180, artist: 'Demo Artist', genre: 'Electronic' },
        playCount: 89,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'demo-3',
        artistId: demoArtistId,
        walrusBlobId: 'walrus-3',
        title: 'Behind the Scenes (VIP Only)',
        description: 'Studio session recording',
        contentType: 'exclusive',
        isPrivate: true,
        metadata: { duration: 420, artist: 'Demo Artist', genre: 'Documentary' },
        playCount: 23,
        createdAt: new Date().toISOString(),
      },
    ];

    // In production, fetch from database
    setArtistContent(demoContent);
  };

  const handleSupport = async (tier: 1 | 2 | 3) => {
    // In production, this would create a real supporter relationship
    const success = await walrusStorage.addSupporter(demoArtistId, demoUserId, tier);
    if (success) {
      setIsSupporter(true);
      setSupportTier(tier);
    }
  };

  const supportTiers = [
    {
      tier: 1,
      name: 'Basic Supporter',
      price: '$5/month',
      benefits: ['Access to exclusive tracks', 'Early releases', 'Supporter badge'],
      color: 'from-blue-400 to-blue-600',
    },
    {
      tier: 2,
      name: 'Premium Supporter',
      price: '$15/month',
      benefits: ['Everything in Basic', 'Behind the scenes content', 'Monthly video calls'],
      color: 'from-purple-400 to-purple-600',
    },
    {
      tier: 3,
      name: 'VIP Supporter',
      price: '$50/month',
      benefits: ['Everything in Premium', 'Personal shoutouts', '1-on-1 sessions'],
      color: 'from-amply-orange to-amply-pink',
    },
  ];

  return (
    <div className="min-h-screen bg-amply-cream">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-amply-black">Walrus Vault Demo</h1>
            <Link href="/artist">
              <Button className="amply-button-outline">Back to Artist Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Artist Profile Section */}
        <Card className="bg-white shadow-card rounded-3xl mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-amply-orange to-amply-pink rounded-3xl flex items-center justify-center">
                  <Music className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-amply-black">Demo Artist</h2>
                  <p className="text-gray-600 mt-1">Electronic & Chill Music Producer</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      156 Supporters
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      2.4M Total Plays
                    </span>
                  </div>
                </div>
              </div>
              {isSupporter && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-2xl">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">
                    Tier {supportTier} Supporter
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Support Tiers */}
        {!isSupporter && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-amply-black mb-6">Support This Artist</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportTiers.map((tier) => (
                <Card key={tier.tier} className="bg-white shadow-card rounded-3xl overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{tier.name}</span>
                      <Star className="w-5 h-5 text-yellow-500" />
                    </CardTitle>
                    <CardDescription className="text-2xl font-bold text-amply-black">
                      {tier.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSupport(tier.tier as 1 | 2 | 3)}
                      className={`w-full py-3 rounded-2xl bg-gradient-to-r ${tier.color} text-white hover:opacity-90`}
                    >
                      Become a {tier.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div>
          <h3 className="text-2xl font-bold text-amply-black mb-6 flex items-center">
            <Music className="w-6 h-6 mr-2" />
            Artist Content
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artistContent.map((content) => (
              <WalrusContentPlayer
                key={content.id}
                content={content}
                artistName="Demo Artist"
                userId={demoUserId}
                onSupportArtist={() => {
                  const element = document.querySelector('h3');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </div>

        {/* Vault Info */}
        <Card className="bg-gradient-to-br from-amply-orange/10 to-amply-pink/10 border-0 shadow-card rounded-3xl mt-8">
          <CardHeader>
            <CardTitle className="flex items-center text-amply-black">
              <Lock className="w-5 h-5 mr-2" />
              About Private Vaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Private vaults are a revolutionary way for artists to share exclusive content with their most dedicated fans.
              All content is stored permanently on the decentralized Walrus network, ensuring it&apos;s always available and
              censorship-resistant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-white rounded-2xl">
                <h4 className="font-semibold text-amply-black mb-2">For Artists</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Direct monetization from supporters</li>
                  <li>• Full control over content access</li>
                  <li>• Permanent, decentralized storage</li>
                  <li>• Real human verification via World ID</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded-2xl">
                <h4 className="font-semibold text-amply-black mb-2">For Supporters</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Exclusive access to unreleased content</li>
                  <li>• Direct support to favorite artists</li>
                  <li>• Different tiers for various budgets</li>
                  <li>• Permanent access to purchased content</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}