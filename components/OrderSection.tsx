'use client';

import React from 'react';
import Image from 'next/image';
import { CalendarCheck, ShoppingBag } from 'lucide-react';

interface OrderSectionProps {
  onOpenOrderModal: () => void;
  onOpenReservationModal: () => void;
}

export default function OrderSection({
  onOpenOrderModal,
  onOpenReservationModal,
}: OrderSectionProps) {
  return (
    <section id="commander" className="py-20 lg:py-28 bg-[#0D0D0D] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-widest bg-[#FF5A1F]/10 px-3.5 py-1.5 rounded-full inline-block border border-[#FF5A1F]/20">
              Service Sur-Mesure
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Commandez Votre <br />
              <span className="text-[#FF5A1F]">Expérience Sushi</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Que ce soit pour une commande à emporter, une livraison express ou une réservation en salle, vivez l&apos;expérience Ember Sushi avec la même exigence et fraîcheur exceptionnelle.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenOrderModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white bg-[#FF5A1F] hover:bg-[#E04A15] rounded-full transition-all duration-300 shadow-xl shadow-[#FF5A1F]/30 hover:shadow-[#FF5A1F]/50 hover:-translate-y-0.5 active:translate-y-0"
                id="btn-order-now"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Commander maintenant</span>
              </button>

              <button
                onClick={onOpenReservationModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-gray-200 bg-white/5 hover:bg-white/10 rounded-full border border-white/15 transition-all duration-300 hover:text-white"
                id="btn-order-reserve-secondary"
              >
                <CalendarCheck className="w-5 h-5 text-[#FF5A1F]" />
                <span>Réserver une table</span>
              </button>
            </div>
          </div>

          {/* Right Image (Portrait mode) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <Image
                src="/images/sushi_diagonal.webp"
                alt="Plat de sushi avec baguettes en diagonale"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: '65% center' }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
