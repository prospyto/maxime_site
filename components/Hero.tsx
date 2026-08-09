'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenReservation: () => void;
}

export default function Hero({ onOpenReservation }: HeroProps) {
  return (
    <section id="hero" className="relative bg-[#0D0D0D] pt-32 sm:pt-40 pb-28 sm:pb-36 min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image showing the sushi platter with baked-in white brush border */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_sushi_plate.webp"
          alt="Ember Sushi Background"
          fill
          priority
          className="object-cover object-right md:object-center opacity-100"
          sizes="100vw"
          referrerPolicy="no-referrer"
        />
        {/* Soft subtle left gradient to ensure text readability without obscuring the background food photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent max-w-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-xl text-left space-y-6 sm:space-y-8">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
            Une Expérience Sushi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-[#FF5A1F]">
              Moderne & Authentique
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-normal drop-shadow-md">
            Chez <strong className="text-white font-semibold">Ember Sushi</strong>, chaque pièce est façonnée à la main avec des produits frais d&apos;exception. Une gastronomie japonaise raffinée et créative.
          </p>

          {/* Single Action Button: Découvrir */}
          <div className="pt-2">
            <a
              href="#specialites"
              className="inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-white bg-[#FF5A1F] hover:bg-[#E04A15] rounded-full transition-all duration-300 shadow-xl shadow-[#FF5A1F]/40 hover:shadow-[#FF5A1F]/60 hover:-translate-y-0.5"
              id="btn-hero-menu"
            >
              <span>Découvrir</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

