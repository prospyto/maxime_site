'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Star, Plus, Minus, Check, Flame, ShieldCheck, Heart } from 'lucide-react';
import { Dish } from './TabbedShowcase';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (dish: Dish, quantity: number) => void;
  isAdded: boolean;
}

export default function DishDetailModal({
  dish,
  onClose,
  onAddToCart,
  isAdded,
}: DishDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);

  if (!dish) return null;

  const handleAdd = () => {
    onAddToCart(dish, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121212] text-white w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Top Image Banner */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 600px"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => setFavorite(!favorite)}
            className={`absolute top-4 left-4 p-2.5 rounded-full backdrop-blur-md transition-colors border border-white/10 ${
              favorite ? 'bg-red-500 text-white' : 'bg-black/60 text-gray-300 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${favorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-xs font-bold uppercase text-[#FF5A1F] tracking-wider">
                {dish.category} Signature
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">{dish.name}</h3>
            </div>
            <span className="text-xl font-extrabold text-[#FF5A1F] whitespace-nowrap bg-[#FF5A1F]/10 px-3 py-1 rounded-full border border-[#FF5A1F]/20">
              {dish.priceFormatted}
            </span>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed font-normal">
            {dish.description}
          </p>

          {/* Ingredients & Details Pills */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Caractéristiques</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Poisson sauvage frais
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                Portion : {dish.pieces}
              </span>
              {dish.spicy && (
                <span className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-red-400" /> Épicé modéré
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-white/10 bg-[#1A1A1A] flex items-center gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-extrabold w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-[#FF5A1F] hover:bg-[#E04A15] flex items-center justify-center text-sm font-bold text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className={`flex-1 py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FF5A1F] hover:bg-[#E04A15] text-white shadow-[#FF5A1F]/30'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Modifié dans le Panier</span>
              </>
            ) : (
              <span>Ajouter ({(dish.price * quantity).toLocaleString()} FCFA)</span>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
