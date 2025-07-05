import type React from "react"
import type { Metadata } from "next"
import BottomNavigation from "@/components/bottom-navigation"
import "./globals.css"

export const metadata: Metadata = {
  title: "Amply - The Future of Music is Human",
  description: "Only real humans. Only real music. Empowering emerging artists with Web3 and World ID verification.",
  keywords: [
    "music",
    "web3",
    "nft",
    "decentralized",
    "artists",
    "streaming",
    "blockchain",
    "world id",
    "human verification",
    "authentic music",
  ],
  authors: [{ name: "Amply Team" }],
  creator: "Amply",
  publisher: "Amply",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://amply.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Amply - The Future of Music is Human",
    description: "Only real humans. Only real music. Empowering emerging artists with Web3 and World ID verification.",
    url: "https://amply.app",
    siteName: "Amply",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Amply Logo - Eye with Lightning Bolt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amply - The Future of Music is Human",
    description: "Only real humans. Only real music. Empowering emerging artists with Web3 and World ID verification.",
    images: ["/icons/icon-512x512.png"],
    creator: "@AmplyMusic",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/icons/icon-192x192.png",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Amply" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Amply" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#FF8C00" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#FF8C00" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/icon-128x128.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-128x128.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        {/* Favicon - Updated for new logo */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Viewport optimized for PWA */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
        />
      </head>
      <body className="bg-amply-gray-light font-sans antialiased safe-area-top safe-area-bottom">
        {children}
        <BottomNavigation />
        <div className="md:hidden h-20 safe-area-bottom"></div>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('✅ SW registered successfully:', registration.scope);
                    })
                    .catch(function(registrationError) {
                      console.error('❌ SW registration failed:', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}