'use client';

import React from 'react';
import Image from 'next/image';
import { Fish, Sparkles, HeartHandshake } from 'lucide-react';

export default function Philosophy() {
  return (
    <section id="philosophie" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background split: Top half white (with header), bottom half dark black (#0D0D0D) behind lower part of cards */}
      <div className="absolute top-0 left-0 right-0 h-[52%] bg-white z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-[48%] bg-[#0D0D0D] z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (on White background) */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest bg-[#FF5A1F]/10 px-3.5 py-1.5 rounded-full inline-block border border-[#FF5A1F]/20">
            Engagement & Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Notre Philosophie Culinaire
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
            Fraîcheur, précision, passion — trois piliers indissociables qui définissent chacune de nos assiettes.
          </p>
        </div>

        {/* 4-Column Grid: Image, Card 1, Card 2, Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Col 1: Image Sashimi Macro */}
          <div className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-2xl h-72 sm:h-auto min-h-[280px]">
            <Image
              src="/images/sashimi_macro.webp"
              alt="Sashimi en gros plan"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Col 2: Card Produits Frais */}
          <div className="bg-white p-8 rounded-2xl flex flex-col justify-center items-center text-center border border-gray-100 shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-full bg-[#FF5A1F]/10 flex items-center justify-center mb-6 text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors duration-300">
              <Fish className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Produits Frais</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Nos poissons sont sélectionnés chaque matin auprès de fournisseurs locaux et internationaux rigoureusement choisis pour leur fraîcheur irréprochable.
            </p>
          </div>

          {/* Col 3: Card Savoir-Faire */}
          <div className="bg-white p-8 rounded-2xl flex flex-col justify-center items-center text-center border border-gray-100 shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-full bg-[#FF5A1F]/10 flex items-center justify-center mb-6 text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors duration-300">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Savoir-Faire</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Nos chefs maîtrisent les techniques traditionnelles japonaises à la perfection, alliées à une touche contemporaine unique propre à Ember Sushi.
            </p>
          </div>

          {/* Col 4: Image Sushi Rolls Macro */}
          <div className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-2xl h-72 sm:h-auto min-h-[280px]">
            <Image
              src="/images/sushi_rolls_macro.webp"
              alt="Sushi rolls en gros plan"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
