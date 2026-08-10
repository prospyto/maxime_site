'use client';

import React, { useEffect, useState } from 'react';
import SplashScreen from './SplashScreen';

const MIN_DISPLAY_MS = 700; // avoids an unpleasant flash on fast connections
const FADE_MS = 500;

/**
 * Shows the branded splash screen from the moment the app mounts
 * until the page has fully finished loading (all assets, fonts, images),
 * then fades it out smoothly.
 */
export default function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      window.setTimeout(() => {
        setFadingOut(true);
        window.setTimeout(() => setVisible(false), FADE_MS);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish);
      return () => window.removeEventListener('load', finish);
    }
  }, []);

  return <SplashScreen show={visible} fadingOut={fadingOut} label="Veuillez patienter..." />;
}
