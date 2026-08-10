'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

/**
 * Watches the browser's online/offline status.
 * When the connection drops, shows a full-screen "please wait" overlay
 * and automatically dismisses it once the connection returns.
 */
export default function ConnectionWatcher() {
  const [isOffline, setIsOffline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[999] bg-[#0D0D0D]/97 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in duration-300"
    >
      <div className="text-center space-y-5 max-w-sm">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-[#FF5A1F]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#FF5A1F] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-[#FF5A1F]">
            <WifiOff className="w-6 h-6" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-white">Connexion perdue</h2>
          <p className="text-sm text-gray-400">
            Veuillez patienter, nous rétablissons la connexion...
          </p>
        </div>
      </div>
    </div>
  );
}
