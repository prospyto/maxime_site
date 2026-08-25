'use client';

import React from 'react';
import Image from 'next/image';
import { Fish, Sparkles, HeartHandshake } from 'lucide-react';
import Reveal from './Reveal';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const PHILOSOPHY_DEFAULTS = {
  philo_badge: 'Engagement & Excellence',
  philo_title: 'Notre Philosophie Culinaire',
  philo_subtitle: 'Fraîcheur, précision, passion — trois piliers indissociables qui définissent chacune de nos assiettes.',
  philo_card1_title: 'Produits Frais',
  philo_card1_text: 'Nos poissons sont sélectionnés chaque matin auprès de fournisseurs locaux et internationaux rigoureusement choisis pour leur fraîcheur irréprochable.',
  philo_card2_title: 'Savoir-Faire',
  philo_card2_text: 'Nos chefs maîtrisent les techniques traditionnelles japonaises à la perfection, alliées à une touche contemporaine unique propre à Ember Sushi.',
  philo_image1: '/images/sashimi_macro.webp',
  philo_image2: '/images/sushi_rolls_macro.webp',
};

export default function Philosophy() {
  const content = useContentBlocks(PHILOSOPHY_DEFAULTS);

  return (
    <section id="philosophie" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background split: Top half white (with header), bottom half dark black (#0D0D0D) behind lower part of cards */}
      <div className="absolute top-0 left-0 right-0 h-[52%] bg-white z-0" />
      <div className="absolute bottom-0 left-0 right-0 h-[48%] bg-[#0D0D0D] z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (on White background) */}
        <Reveal className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest bg-[#FF5A1F]/10 px-3.5 py-1.5 rounded-full inline-block border border-[#FF5A1F]/20">
            {content.philo_badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            {content.philo_title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
            {content.philo_subtitle}
          </p>
        </Reveal>

        {/* 4-Column Grid: Image, Card 1, Card 2, Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Col 1: Image Sashimi Macro */}
          <Reveal delay={0} className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-2xl h-72 sm:h-auto min-h-[280px]">
            <Image
              src={content.philo_image1}
              alt="Sashimi en gros plan"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              referrerPolicy="no-referrer"
            />
          </Reveal>

          {/* Col 2: Card Produits Frais */}
          <Reveal delay={0.1} className="bg-white p-8 rounded-2xl flex flex-col justify-center items-center text-center border border-gray-100 shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-full bg-[#FF5A1F]/10 flex items-center justify-center mb-6 text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors duration-300">
              <Fish className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{content.philo_card1_title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              {content.philo_card1_text}
            </p>
          </Reveal>

          {/* Col 3: Card Savoir-Faire */}
          <Reveal delay={0.2} className="bg-white p-8 rounded-2xl flex flex-col justify-center items-center text-center border border-gray-100 shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-full bg-[#FF5A1F]/10 flex items-center justify-center mb-6 text-[#FF5A1F] group-hover:bg-[#FF5A1F] group-hover:text-white transition-colors duration-300">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{content.philo_card2_title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              {content.philo_card2_text}
            </p>
          </Reveal>

          {/* Col 4: Image Sushi Rolls Macro */}
          <Reveal delay={0.3} className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-2xl h-72 sm:h-auto min-h-[280px]">
            <Image
              src={content.philo_image2}
              alt="Sushi rolls en gros plan"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              referrerPolicy="no-referrer"
            />
          </Reveal>

        </div>
      </div>
    </section>
  );
}
