'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Charge un ensemble de blocs de contenu par clé, avec des valeurs par
 * défaut immédiates (pas de flash de contenu vide) pendant le chargement.
 *
 * Usage :
 *   const content = useContentBlocks({
 *     hero_title_line1: 'Une Expérience Sushi',
 *     hero_subtitle: '...',
 *   });
 *   content.hero_title_line1 // valeur Supabase si dispo, sinon le défaut
 */
export function useContentBlocks<T extends Record<string, string>>(defaults: T): T {
  const [values, setValues] = useState<T>(defaults);

  useEffect(() => {
    let active = true;

    supabase
      .from('content_blocks')
      .select('key, value')
      .in('key', Object.keys(defaults))
      .then(({ data, error }) => {
        if (error || !data || !active) return;
        setValues((prev) => {
          const next = { ...prev };
          for (const row of data) {
            if (row.value !== null && row.key in next) {
              (next as Record<string, string>)[row.key] = row.value;
            }
          }
          return next;
        });
      });

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return values;
}
