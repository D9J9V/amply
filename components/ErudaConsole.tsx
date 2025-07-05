'use client';

import { useEffect, useState } from 'react';

export default function ErudaConsole() {
  const [eruda, setEruda] = useState<typeof import('eruda').default | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load Eruda on mount
    const loadEruda = async () => {
      try {
        const erudaModule = (await import('eruda')).default;
        setEruda(erudaModule);
        
        // Auto-initialize if in MiniApp or mobile environment
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isMiniApp = typeof window !== 'undefined' && 'MiniKit' in window;
        
        if (isMiniApp || isMobile) {
          erudaModule.init({
            useShadowDom: true,
            autoScale: true,
            defaults: {
              displaySize: 50,
              transparency: 0.9,
              theme: 'dark'
            }
          });
          
          // Position the entry button
          erudaModule.position({
            x: window.innerWidth - 60,
            y: 20 // Top right to avoid conflict with toggle button
          });
          
          // Start hidden, user can open with toggle
          erudaModule.hide();
          
          // Add initial debug info
          console.log('[Amply] Debug Console Ready');
          console.log('[Amply] Environment:', process.env.NODE_ENV);
          console.log('[Amply] Platform:', navigator.platform);
          console.log('[Amply] MiniKit available:', isMiniApp);
          console.log('[Amply] Mobile device:', isMobile);
          console.log('[Amply] User Agent:', navigator.userAgent);
          console.log('[Amply] Screen:', `${window.screen.width}x${window.screen.height}`);
          console.log('[Amply] Viewport:', `${window.innerWidth}x${window.innerHeight}`);
        }
      } catch (error) {
        console.error('[Eruda] Failed to load:', error);
      }
    };
    
    loadEruda();
  }, []);

  const toggleEruda = () => {
    if (!eruda) return;
    
    if (isVisible) {
      eruda.hide();
    } else {
      eruda.show();
    }
    
    setIsVisible(!isVisible);
  };

  return (
    <button
      onClick={toggleEruda}
      className="fixed bottom-4 right-4 z-[9999] px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-md shadow-lg hover:bg-purple-700 active:scale-95 transition-all"
      aria-label="Toggle debug console"
    >
      {isVisible ? 'Hide' : 'Debug'}
    </button>
  );
}