'use client';

import React from 'react';
import Image from 'next/image';
import { CalendarCheck, ShoppingBag } from 'lucide-react';
import Reveal from './Reveal';
import { useContentBlocks } from '@/hooks/useContentBlocks';

interface OrderSectionProps {
  onOpenOrderModal: () => void;
  onOpenReservationModal: () => void;
}

const ORDER_DEFAULTS = {
  order_badge: 'Service Sur-Mesure',
  order_title_line1: 'Commandez Votre',
  order_title_highlight: 'Expérience Sushi',
  order_subtitle: 'Que ce soit pour une commande à emporter, une livraison express ou une réservation en salle, vivez l\u2019expérience Ember Sushi avec la même exigence et fraîcheur exceptionnelle.',
  order_image: '/images/sushi_diagonal.webp',
  cta_order_commander: 'Commander maintenant',
  cta_reserver_table: 'Réserver une table',
};

export default function OrderSection({
  onOpenOrderModal,
  onOpenReservationModal,
}: OrderSectionProps) {
  const content = useContentBlocks(ORDER_DEFAULTS);
  return (
    <section id="commander" className="relative py-20 lg:py-28 text-white overflow-hidden">
      {/* Full-section background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.order_image}
          alt="Plat de sushi avec baguettes en diagonale"
          fill
          className="object-cover"
          style={{ objectPosition: '65% center' }}
          sizes="100vw"
          referrerPolicy="no-referrer"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/85 to-[#0D0D0D]/40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Text Content */}
        <Reveal className="max-w-2xl space-y-6 text-center lg:text-left mx-auto lg:mx-0">
            <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest bg-[#FF5A1F]/10 px-3.5 py-1.5 rounded-full inline-block border border-[#FF5A1F]/20">
              {content.order_badge}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              {content.order_title_line1} <br />
              <span className="text-[#FF5A1F]">{content.order_title_highlight}</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              {content.order_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenOrderModal}
                className="btn-shine w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-[#FF5A1F] hover:bg-[#E04A15] rounded-full transition-all duration-300 shadow-xl shadow-[#FF5A1F]/30 hover:shadow-[#FF5A1F]/50 hover:-translate-y-0.5 active:translate-y-0"
                id="btn-order-now"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{content.cta_order_commander}</span>
              </button>

              <button
                onClick={onOpenReservationModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-gray-200 bg-white/5 hover:bg-white/10 rounded-full border border-white/15 transition-all duration-300 hover:text-white"
                id="btn-order-reserve-secondary"
              >
                <CalendarCheck className="w-5 h-5 text-[#FF5A1F]" />
                <span>{content.cta_reserver_table}</span>
              </button>
            </div>
        </Reveal>

      </div>
    </section>
  );
}
