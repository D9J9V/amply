"use client";

import Link from "next/link";

export default function TestHome() {
  const testPages = [
    {
      title: "World ID Integration",
      description: "Test World ID verification and authentication flows",
      href: "/test/world",
      icon: "🌍"
    },
    {
      title: "Ledger Integration",
      description: "Test hardware wallet connection and NFT signing",
      href: "/test/ledger",
      icon: "🔐"
    },
    {
      title: "Walrus Storage",
      description: "Test decentralized file upload and retrieval",
      href: "/test/walrus",
      icon: "🐋"
    },
    {
      title: "Live Listening Party",
      description: "Test Supabase realtime, WebRTC, and synchronized playback",
      href: "/test/listening-party",
      icon: "🎵"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-4">Integration Test Suite</h1>
        <p className="text-gray-400 mb-8">
          Test and debug Amply&apos;s various integrations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors border border-gray-800 hover:border-purple-600"
            >
              <div className="text-4xl mb-4">{page.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{page.title}</h2>
              <p className="text-gray-400 text-sm">{page.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-purple-900/20 border border-purple-800 rounded-lg p-6">
          <h3 className="font-semibold mb-2">🛠️ Developer Notes</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• These test pages are for development only</li>
            <li>• Each integration has isolated test components</li>
            <li>• Check console for detailed debug information</li>
            <li>• See /docs for implementation guides</li>
          </ul>
        </div>
      </div>
    </div>
  );
}