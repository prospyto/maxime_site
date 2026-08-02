'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Plus, Check, ShoppingBag, Flame, Quote, Sparkles } from 'lucide-react';

export interface Dish {
  id: string;
  name: string;
  category: 'nigiri' | 'sashimi' | 'rolls' | 'chirashi' | 'signature';
  price: number; // in FCFA
  priceFormatted: string;
  description: string;
  pieces: string;
  image: string;
  rating: number;
  popular?: boolean;
  spicy?: boolean;
}

interface TabbedShowcaseProps {
  onAddToCart: (dish: Dish) => void;
  onOpenDishDetail: (dish: Dish) => void;
  addedDishIds: string[];
}

export const sampleDishes: Dish[] = [
  {
    id: '1',
    name: 'Saumon Nigiri Aburi',
    category: 'nigiri',
    price: 4500,
    priceFormatted: '4 500 FCFA',
    description: 'Nigiri au saumon atlantique légèrement flambé au chalumeau, huile de sésame et perles de caviar.',
    pieces: '6 pièces',
    image: '/images/sashimi_macro.jpg',
    rating: 4.9,
    popular: true,
  },
  {
    id: '2',
    name: 'California Roll Signature',
    category: 'rolls',
    price: 5000,
    priceFormatted: '5 000 FCFA',
    description: 'Chair de crabe royal, avocat, concombre croquant et tobiko orange éclatant.',
    pieces: '8 pièces',
    image: '/images/sushi_rolls_macro.jpg',
    rating: 4.8,
    popular: true,
  },
  {
    id: '3',
    name: 'Plateau Découverte Omakase',
    category: 'signature',
    price: 9500,
    priceFormatted: '9 500 FCFA',
    description: 'Assortiment d’exception : 4 Nigiri Saumon/Thon, 4 Sashimi et 4 Dragon Rolls flambés.',
    pieces: '12 pièces',
    image: '/images/hero_sushi_plate.jpg',
    rating: 5.0,
    popular: true,
  },
  {
    id: '4',
    name: 'Sashimi Premium Thon & Saumon',
    category: 'sashimi',
    price: 6000,
    priceFormatted: '6 000 FCFA',
    description: 'Tranches épaisses de saumon d’Écosse et thon rouge de ligne, gingembre mariné artisanal.',
    pieces: '8 pièces',
    image: '/images/sushi_diagonal.jpg',
    rating: 4.9,
    popular: true,
  },
  {
    id: '5',
    name: 'Dragon Roll Ember Flambé',
    category: 'rolls',
    price: 7500,
    priceFormatted: '7 500 FCFA',
    description: 'Crevette tempura croustillante, surmonté d’avocat fondant et saumon flambé à la sauce unagi.',
    pieces: '8 pièces',
    image: '/images/black_plate_leaf.jpg',
    rating: 4.9,
    spicy: true,
  },
  {
    id: '6',
    name: 'Bol Chirashi Gourmand',
    category: 'chirashi',
    price: 8000,
    priceFormatted: '8 000 FCFA',
    description: 'Riz vinegre assaisonné couvert de dés de poissons crus, ikura, edamame et radis pickled.',
    pieces: '1 grand bol',
    image: '/images/sushi_bowl.jpg',
    rating: 4.8,
  },
];

const customerReviews = [
  {
    id: 1,
    name: 'Jean-Marc K.',
    role: 'Gastronome Averti',
    avatar: 'JK',
    rating: 5,
    date: 'Il y a 2 jours',
    comment: 'Une fraîcheur absolue ! Le Saumon Nigiri Flambé est tout simplement le meilleur de la ville. Le cadre sombre et feutré ajoute une vraie touche de luxe.',
  },
  {
    id: 2,
    name: 'Sarah Benali',
    role: 'Cliente Régulière',
    avatar: 'SB',
    rating: 5,
    date: 'Il y a 1 semaine',
    comment: 'Commande livrée en 35 minutes, emballage zéro défaut et la température était parfaite. Les Dragon Rolls sont une tuerie !',
  },
  {
    id: 3,
    name: 'Alexandre V.',
    role: 'Critique Culinaire',
    avatar: 'AV',
    rating: 5,
    date: 'Il y a 2 semaines',
    comment: 'Ember Sushi surpasse les standards de la cuisine japonaise moderne. Le plateau Omakase est une œuvre d’art visuelle et gustative.',
  },
];

export default function TabbedShowcase({
  onAddToCart,
  onOpenDishDetail,
  addedDishIds,
}: TabbedShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'plats-signature' | 'menu-populaire' | 'avis-clients'>('menu-populaire');

  return (
    <div className="relative bg-[#F8F9FA] text-gray-900 pb-20">
      
      {/* Floating Segmented Pill Container (-translate-y-1/2 overlapping sections) */}
      <div className="relative z-30 max-w-2xl mx-auto px-4 -translate-y-1/2">
        <div className="glass-tab-bar p-2 rounded-full border border-gray-200 shadow-xl flex items-center justify-between">
          <button
            onClick={() => setActiveTab('plats-signature')}
            className={`flex-1 py-3 px-4 sm:px-6 text-sm font-bold rounded-full transition-all duration-300 text-center ${
              activeTab === 'plats-signature'
                ? 'bg-[#FF5A1F] text-white shadow-md shadow-[#FF5A1F]/30 scale-[1.02]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
            }`}
            id="tab-btn-plats"
          >
            Nos Plats
          </button>

          <button
            onClick={() => setActiveTab('menu-populaire')}
            className={`flex-1 py-3 px-4 sm:px-6 text-sm font-bold rounded-full transition-all duration-300 text-center ${
              activeTab === 'menu-populaire'
                ? 'bg-[#FF5A1F] text-white shadow-md shadow-[#FF5A1F]/30 scale-[1.02]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
            }`}
            id="tab-btn-menu-populaire"
          >
            Menu Populaire
          </button>

          <button
            onClick={() => setActiveTab('avis-clients')}
            className={`flex-1 py-3 px-4 sm:px-6 text-sm font-bold rounded-full transition-all duration-300 text-center ${
              activeTab === 'avis-clients'
                ? 'bg-[#FF5A1F] text-white shadow-md shadow-[#FF5A1F]/30 scale-[1.02]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
            }`}
            id="tab-btn-avis"
          >
            Avis Clients
          </button>
        </div>
      </div>

      {/* Tab Content Rendering */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* TAB 1: Nos Plats Grid */}
        {activeTab === 'plats-signature' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Toutes nos Créations Gourmandes</h3>
              <p className="text-sm text-gray-500 mt-1">Sélectionnez et ajoutez directement à votre panier de dégustation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleDishes.map((dish) => {
                const isAdded = addedDishIds.includes(dish.id);
                return (
                  <div
                    key={dish.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Container */}
                      <div
                        className="relative h-56 w-full cursor-pointer overflow-hidden"
                        onClick={() => onOpenDishDetail(dish)}
                      >
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            onClick={() => onOpenDishDetail(dish)}
                            className="text-lg font-bold text-gray-900 hover:text-[#FF5A1F] cursor-pointer transition-colors"
                          >
                            {dish.name}
                          </h4>
                          <span className="text-base font-extrabold text-[#FF5A1F] whitespace-nowrap">
                            {dish.priceFormatted}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="p-6 pt-0">
                      <button
                        onClick={() => onAddToCart(dish)}
                        className={`w-full py-3 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                          isAdded
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-[#FF5A1F] hover:bg-[#E04A15] text-white shadow-md shadow-[#FF5A1F]/20'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Ajouté au panier</span>
                          </>
                        ) : (
                          <span>Ajouter au panier</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Menu Populaire (Default Active Tab) */}
        {activeTab === 'menu-populaire' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider bg-[#FF5A1F]/10 px-3 py-1 rounded-full inline-block">
                Incontournables
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">Les Incontournables d&apos;Ember Sushi</h3>
              <p className="text-sm text-gray-600 mt-1">Plats les plus commandés et plébiscités par nos clients réguliers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleDishes.filter((d) => d.popular).map((dish) => {
                const isAdded = addedDishIds.includes(dish.id);
                return (
                  <div
                    key={dish.id}
                    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-center group"
                  >
                    <div
                      className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden shrink-0 cursor-pointer"
                      onClick={() => onOpenDishDetail(dish)}
                    >
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="144px"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4
                          onClick={() => onOpenDishDetail(dish)}
                          className="text-base font-bold text-gray-900 hover:text-[#FF5A1F] cursor-pointer transition-colors"
                        >
                          {dish.name}
                        </h4>
                        <span className="text-sm font-extrabold text-[#FF5A1F]">
                          {dish.priceFormatted}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2">
                        {dish.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {dish.rating} / 5
                        </span>

                        <button
                          onClick={() => onAddToCart(dish)}
                          className={`py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#FF5A1F] hover:bg-[#E04A15] text-white shadow'
                          }`}
                        >
                          {isAdded ? '✓ Dans le panier' : 'Commander'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Avis Clients */}
        {activeTab === 'avis-clients' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider bg-[#FF5A1F]/10 px-3 py-1 rounded-full inline-block">
                Expériences Reçues
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">Ce que disent nos Gourmets</h3>
              <p className="text-sm text-gray-600 mt-1">Note moyenne de 4.9/5 sur plus de 1,200 avis vérifiés.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {customerReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative"
                >
                  <Quote className="w-10 h-10 text-[#FF5A1F]/15 absolute top-6 right-6" />

                  <div className="space-y-4">
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed font-normal italic">
                      &quot;{review.comment}&quot;
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF5A1F] text-white font-extrabold text-sm flex items-center justify-center">
                      {review.avatar}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-900">{review.name}</h5>
                      <p className="text-xs text-gray-500">{review.role} • {review.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
