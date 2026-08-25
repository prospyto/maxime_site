'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ShoppingBag, Send } from 'lucide-react';
import Reveal from './Reveal';
import { useContentBlocks } from '@/hooks/useContentBlocks';

interface ContactMenuSectionProps {
  onOpenOrderModal: () => void;
  onOpenReservationModal: () => void;
  onGoToMenu: (tab: 'plats-signature' | 'menu-populaire') => void;
}

const CONTACT_DEFAULTS = {
  contact_badge: 'Information & Dégustation',
  contact_title: 'Contactez-nous',
  contact_subtitle: 'Une question, une réservation de groupe, un événement privé ? Notre équipe dévouée vous répond immédiatement.',
  contact_image: '/images/black_plate_leaf.webp',
  contact_feature1_label: 'Adresse',
  contact_feature1_text: '142 Avenue des Champs-Élysées, 75008 Paris & Plateau, Abidjan',
  contact_feature2_label: 'Livraison',
  contact_feature2_text: 'Disponible en moins de 45 min',
  contact_feature3_label: 'Réservation en ligne',
  contact_feature3_text: 'Confirmation instantanée',
  contact_feature4_label: 'Événements privés',
  contact_feature4_text: 'Traiteur & Chef à domicile',
  contact_feature5_label: 'Click & Collect',
  contact_feature5_text: 'Prêt en 15 minutes',
};

export default function ContactMenuSection({
  onOpenOrderModal,
  onOpenReservationModal,
  onGoToMenu,
}: ContactMenuSectionProps) {
  const content = useContentBlocks(CONTACT_DEFAULTS);

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white text-gray-900 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest bg-[#FF5A1F]/10 px-3.5 py-1.5 rounded-full inline-block">
            {content.contact_badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            {content.contact_title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
            {content.contact_subtitle}
          </p>
        </Reveal>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Image + Features List */}
          <Reveal direction="left" className="lg:col-span-6 bg-[#F8F9FA] p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden shadow-md">
              <Image
                src={content.contact_image}
                alt="Sushi sur assiette noire, décoration feuille verte"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
                referrerPolicy="no-referrer"
              />
            </div>

            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3 text-sm sm:text-base font-semibold text-gray-800">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF3B30] shrink-0 mt-1" />
                <span><strong className="text-gray-900">{content.contact_feature1_label} :</strong> {content.contact_feature1_text}</span>
              </li>

              <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-gray-800">
                <span className="w-3.5 h-3.5 rounded-full bg-[#34C759] shrink-0" />
                <span><strong className="text-gray-900">{content.contact_feature2_label} :</strong> {content.contact_feature2_text}</span>
              </li>

              <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-gray-800">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FFCC00] shrink-0" />
                <span><strong className="text-gray-900">{content.contact_feature3_label} :</strong> {content.contact_feature3_text}</span>
              </li>

              <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-gray-800">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF3B30] shrink-0" />
                <span><strong className="text-gray-900">{content.contact_feature4_label} :</strong> {content.contact_feature4_text}</span>
              </li>

              <li className="flex items-center gap-3 text-sm sm:text-base font-semibold text-gray-800">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF3B30] shrink-0" />
                <span><strong className="text-gray-900">{content.contact_feature5_label} :</strong> {content.contact_feature5_text}</span>
              </li>
            </ul>
          </Reveal>

          {/* Right Column: Menu Populaire Block */}
          <Reveal direction="right" delay={0.1} className="lg:col-span-6 bg-[#F8F9FA] p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900">Menu Populaire</h3>
                <span className="text-xs font-bold text-[#FF5A1F] uppercase bg-[#FF5A1F]/10 px-3 py-1 rounded-full">
                  Tarifs indicatifs
                </span>
              </div>

              <ul className="divide-y divide-dashed divide-gray-300">
                <li className="py-4 flex items-center justify-between font-semibold text-sm sm:text-base">
                  <button onClick={() => onGoToMenu('menu-populaire')} className="flex items-center gap-3 text-gray-900 hover:text-[#FF5A1F] transition-colors text-left">
                    <span className="w-3 h-3 rounded-full bg-[#FF3B30] shrink-0" />
                    <span>Saumon Nigiri (6 pièces)</span>
                  </button>
                  <span className="font-extrabold text-[#FF5A1F]">4 500 FCFA</span>
                </li>

                <li className="py-4 flex items-center justify-between font-semibold text-sm sm:text-base">
                  <button onClick={() => onGoToMenu('menu-populaire')} className="flex items-center gap-3 text-gray-900 hover:text-[#FF5A1F] transition-colors text-left">
                    <span className="w-3 h-3 rounded-full bg-[#FF5A1F] shrink-0" />
                    <span>California Roll Signature</span>
                  </button>
                  <span className="font-extrabold text-[#FF5A1F]">5 000 FCFA</span>
                </li>

                <li className="py-4 flex items-center justify-between font-semibold text-sm sm:text-base">
                  <button onClick={() => onGoToMenu('plats-signature')} className="flex items-center gap-3 text-gray-900 hover:text-[#FF5A1F] transition-colors text-left">
                    <span className="w-3 h-3 rounded-full bg-[#FF3B30] shrink-0" />
                    <span>Plateau Découverte (12 pièces)</span>
                  </button>
                  <span className="font-extrabold text-[#FF5A1F]">9 500 FCFA</span>
                </li>

                <li className="py-4 flex items-center justify-between font-semibold text-sm sm:text-base">
                  <button onClick={() => onGoToMenu('menu-populaire')} className="flex items-center gap-3 text-gray-900 hover:text-[#FF5A1F] transition-colors text-left">
                    <span className="w-3 h-3 rounded-full bg-[#FF3B30] shrink-0" />
                    <span>Sashimi Premium (8 pièces)</span>
                  </button>
                  <span className="font-extrabold text-[#FF5A1F]">6 000 FCFA</span>
                </li>

                <li className="py-4 flex items-center justify-between font-semibold text-sm sm:text-base">
                  <button onClick={() => onGoToMenu('plats-signature')} className="flex items-center gap-3 text-gray-900 hover:text-[#FF5A1F] transition-colors text-left">
                    <span className="w-3 h-3 rounded-full bg-[#FFCC00] shrink-0" />
                    <span>Dragon Roll Flambé (8 pièces)</span>
                  </button>
                  <span className="font-extrabold text-[#FF5A1F]">7 500 FCFA</span>
                </li>
              </ul>
            </div>
          </Reveal>

        </div>

        {/* Final Action Buttons */}
        <Reveal className="mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onGoToMenu('plats-signature')}
            className="btn-shine w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-[#FF5A1F] hover:bg-[#E04A15] rounded-full transition-all duration-300 shadow-lg shadow-[#FF5A1F]/30 hover:-translate-y-0.5"
            id="btn-contact-see-menu"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Voir le menu complet</span>
          </button>

          <button
            onClick={onOpenReservationModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-gray-900 bg-transparent hover:bg-gray-900 hover:text-white border-2 border-gray-900 rounded-full transition-all duration-300"
            id="btn-contact-us"
          >
            <Send className="w-4 h-4" />
            <span>Nous contacter</span>
          </button>
        </Reveal>

      </div>
    </section>
  );
}
