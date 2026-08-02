'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Gem, Palette } from 'lucide-react';

interface SpecialtiesProps {
  onSelectCategory?: (category: string) => void;
}

export default function Specialties({ onSelectCategory }: SpecialtiesProps) {
  return (
    <section id="specialites" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background split: Top half dark black (#0D0D0D) with header, bottom half white behind lower part of cards */}
      <div className="absolute top-0 left-0 right-0 h-[52%] bg-[#0D0D0D] z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-[48%] bg-white z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header (on Black background) */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest bg-[#FF5A1F]/10 px-3.5 py-1.5 rounded-full inline-block border border-[#FF5A1F]/20">
            Menu d&apos;Exception
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Nos Spécialités
          </h2>
          <p className="text-base text-gray-400 font-normal">
            Produits de haute fraîcheur, préparations faites minute.
          </p>
        </div>

        {/* 4 Cards Grid: Card 1 (White) | Card 2 (White) | Card 3 (Image) | Card 4 (White) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Card 1: White Card (Sushi Signature) */}
          <div
            onClick={() => onSelectCategory && onSelectCategory('signature')}
            className="bg-white p-7 sm:p-8 rounded-2xl flex flex-col justify-between text-left border border-gray-100 shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center mb-6 group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors duration-300">
                <Star className="w-6 h-6 fill-[#FF5A1F]/20 group-hover:fill-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FF5A1F] transition-colors">
                Sushi Signature
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                Sélection exclusive de créations artisanales façonnées à la main avec du saumon frais.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
              <span className="px-3.5 py-1.5 rounded-full bg-orange-50 group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors">
                Explorer
              </span>
            </div>
          </div>

          {/* Card 2: White Card (Sashimi Premium) */}
          <div
            onClick={() => onSelectCategory && onSelectCategory('sashimi')}
            className="bg-white p-7 sm:p-8 rounded-2xl flex flex-col justify-between text-left border border-gray-100 shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center mb-6 group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors duration-300">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FF5A1F] transition-colors">
                Sashimi Premium
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                Tranches de poisson cru minutieusement découpées pour une fraîcheur et texture incomparable.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
              <span className="px-3.5 py-1.5 rounded-full bg-orange-50 group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors">
                Découvrir
              </span>
            </div>
          </div>

          {/* Card 3: Image Card (Bol Sushi) */}
          <div className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-2xl min-h-[300px] h-full">
            <Image
              src="/images/sushi_bowl.jpg"
              alt="Bol de sushi et sashimi frais"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Card 4: White Card (Rolls Créatifs) */}
          <div
            onClick={() => onSelectCategory && onSelectCategory('rolls')}
            className="bg-white p-7 sm:p-8 rounded-2xl flex flex-col justify-between text-left border border-gray-100 shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center mb-6 group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors duration-300">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FF5A1F] transition-colors">
                Rolls Créatifs
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                Associations audacieuses entre haute gastronomie japonaise et saveurs fusion contemporaines.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#FF5A1F]">
              <span className="px-3.5 py-1.5 rounded-full bg-orange-50 group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors">
                Découvrir
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

