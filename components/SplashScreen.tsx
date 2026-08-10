'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface SplashScreenProps {
  show: boolean;
  label?: string;
  fadingOut?: boolean;
}

/**
 * Full-screen loading overlay shown before the site is ready
 * (initial load) or while re-establishing a lost connection.
 *
 * Layout: 4 spinning rings arranged in a square (2 top, 2 bottom),
 * alternating spin direction, with the restaurant flame icon
 * pulsing in the center.
 */
export default function SplashScreen({ show, label = 'Veuillez patienter...', fadingOut = false }: SplashScreenProps) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[999] bg-[#0D0D0D] flex items-center justify-center px-4 transition-opacity duration-500 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        {/* 4-circle square formation, opposite spin directions, flame pulsing in the center */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
          {/* Top-left: spins clockwise */}
          <div className="spin-cw absolute top-0 left-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#FF5A1F]/15 border-t-[#FF5A1F]" />
          {/* Top-right: spins counter-clockwise */}
          <div className="spin-ccw absolute top-0 right-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#FF5A1F]/15 border-t-[#FF5A1F]" />
          {/* Bottom-left: spins counter-clockwise */}
          <div className="spin-ccw absolute bottom-0 left-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#FF5A1F]/15 border-t-[#FF5A1F]" />
          {/* Bottom-right: spins clockwise */}
          <div className="spin-cw absolute bottom-0 right-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#FF5A1F]/15 border-t-[#FF5A1F]" />

          {/* Center flame icon, blinking */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#0D0D0D] flex items-center justify-center">
              <Flame className="w-6 h-6 text-[#FF5A1F] fill-[#FF5A1F]/30 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-gray-300 tracking-wide">{label}</p>
        </div>
      </div>
    </div>
  );
}
