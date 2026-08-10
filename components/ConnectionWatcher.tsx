'use client';

import React, { useEffect, useState } from 'react';
import SplashScreen from './SplashScreen';

/**
 * Watches the browser's online/offline status.
 * When the connection drops, shows the branded "please wait" splash screen
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

  return <SplashScreen show={isOffline} label="Connexion perdue. Veuillez patienter..." />;
}
