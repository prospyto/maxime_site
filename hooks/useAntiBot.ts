'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Lightweight, free, no-API-key bot protection for public forms.
 *
 * Combines two well-established techniques:
 * 1. Honeypot field: a form field that's invisible to real humans (hidden via
 *    CSS, not just `display:none` which some bots detect) but visible to
 *    simple bots/scrapers that fill in every field they find. If it's filled,
 *    the submission is treated as spam.
 * 2. Time trap: real humans need at least a couple of seconds to read and
 *    fill a form. A submission that arrives near-instantly after the form
 *    mounted is almost certainly an automated script.
 *
 * Usage:
 *   const { honeypotProps, isLikelyBot, fieldName } = useAntiBot();
 *   ...
 *   <input {...honeypotProps} />
 *   ...
 *   if (isLikelyBot()) { // silently reject, don't tell the bot why
 */
export function useAntiBot(minFillSeconds = 2) {
  const mountedAt = useRef<number | null>(null);
  const [honeypotValue, setHoneypotValue] = useState('');

  const reset = useCallback(() => {
    mountedAt.current = Date.now();
    setHoneypotValue('');
  }, []);

  // Initialize the timer on mount (effects run after render, so this is safe
  // and won't trip the "no impure calls during render" rule).
  useEffect(() => {
    if (mountedAt.current === null) {
      mountedAt.current = Date.now();
    }
  }, []);

  const isLikelyBot = useCallback(() => {
    const filledHoneypot = honeypotValue.trim().length > 0;
    const submittedTooFast = Date.now() - (mountedAt.current ?? Date.now()) < minFillSeconds * 1000;
    return filledHoneypot || submittedTooFast;
  }, [honeypotValue, minFillSeconds]);

  const honeypotProps = {
    name: 'website_url', // innocuous-looking name bots tend to auto-fill
    value: honeypotValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setHoneypotValue(e.target.value),
    tabIndex: -1,
    autoComplete: 'off',
    'aria-hidden': true,
    style: {
      position: 'absolute' as const,
      left: '-9999px',
      width: '1px',
      height: '1px',
      opacity: 0,
      pointerEvents: 'none' as const,
    },
  };

  return { honeypotProps, isLikelyBot, reset };
}
