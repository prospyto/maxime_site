'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId(): string {
  let id = sessionStorage.getItem('ember_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('ember_session_id', id);
  }
  return id;
}

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Ignore les pages admin pour ne pas fausser les stats
    if (pathname?.startsWith('/admin-e9x7k2mq')) return;

    const sessionId = getSessionId();

    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, session_id: sessionId }),
    }).catch(() => {
      // silencieux : le suivi ne doit jamais bloquer l'expérience utilisateur
    });
  }, [pathname]);

  return null;
}
