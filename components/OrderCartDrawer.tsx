'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, Store, CheckCircle, ArrowRight } from 'lucide-react';
import { Dish } from './TabbedShowcase';

export interface CartItem {
  dish: Dish;
  quantity: number;
}

interface OrderCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
}

export default function OrderCartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: OrderCartDrawerProps) {
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.dish.price * item.quantity,
    0
  );
  const deliveryFee = deliveryType === 'delivery' ? 1000 : 0;
  const total = subtotal + (subtotal > 0 ? deliveryFee : 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const num = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    setOrderNumber(num);
    setIsOrdered(true);
  };

  const handleDone = () => {
    setIsOrdered(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121212] text-white shadow-2xl flex flex-col justify-between border-l border-white/10">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#FF5A1F]" />
              <h3 className="text-lg font-bold text-white">Votre Panier</h3>
              <span className="text-xs bg-[#FF5A1F]/20 text-[#FF5A1F] font-bold px-2.5 py-0.5 rounded-full border border-[#FF5A1F]/30">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} articles
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {isOrdered ? (
              /* Success View */
              <div className="text-center py-10 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-extrabold text-white">Commande Confirmée !</h4>
                  <p className="text-xs text-gray-400">Nos chefs préparent vos sushis avec passion.</p>
                </div>

                <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/10 text-left text-xs space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Numéro de Commande :</span>
                    <span className="font-mono font-bold text-[#FF5A1F]">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Mode :</span>
                    <span className="font-bold text-white">
                      {deliveryType === 'delivery' ? 'Livraison Express (45m)' : 'Click & Collect (15m)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total payé :</span>
                    <span className="font-extrabold text-[#FF5A1F] text-sm">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <button
                  onClick={handleDone}
                  className="w-full py-3.5 rounded-full bg-[#FF5A1F] hover:bg-[#E04A15] text-white font-bold text-sm shadow-lg shadow-[#FF5A1F]/30 transition-all"
                >
                  Retour à la Carte
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-300">Votre panier est vide</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Découvrez nos créations sur la carte et ajoutez vos sushis préférés en un clic.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#FF5A1F] hover:bg-[#E04A15] text-white font-bold text-xs transition-colors"
                >
                  Explorer le Menu
                </button>
              </div>
            ) : (
              /* Item List */
              <div className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map(({ dish, quantity }) => (
                    <div
                      key={dish.id}
                      className="bg-[#1A1A1A] p-3 rounded-2xl border border-white/5 flex items-center gap-3"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-white truncate">{dish.name}</h5>
                        <p className="text-xs text-gray-400">{dish.pieces}</p>
                        <p className="text-xs font-bold text-[#FF5A1F] mt-0.5">
                          {(dish.price * quantity).toLocaleString()} FCFA
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                          onClick={() => onUpdateQuantity(dish.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(dish.id, 1)}
                          className="w-6 h-6 rounded-lg bg-[#FF5A1F] hover:bg-[#E04A15] flex items-center justify-center text-xs text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(dish.id)}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery Options */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <label className="block text-xs font-bold text-gray-300">Mode de Réception</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                        deliveryType === 'delivery'
                          ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white'
                          : 'bg-[#1A1A1A] border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-[#FF5A1F]" />
                      <span>Livraison (+1 000 F)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                        deliveryType === 'pickup'
                          ? 'bg-[#FF5A1F]/15 border-[#FF5A1F] text-white'
                          : 'bg-[#1A1A1A] border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <Store className="w-4 h-4 text-[#FF5A1F]" />
                      <span>Emporter (Gratuit)</span>
                    </button>
                  </div>

                  {deliveryType === 'delivery' && (
                    <input
                      type="text"
                      placeholder="Adresse complète de livraison..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5A1F]"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Summary & Checkout CTA */}
          {!isOrdered && cartItems.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#1A1A1A] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total :</span>
                  <span>{subtotal.toLocaleString()} FCFA</span>
                </div>
                {deliveryType === 'delivery' && (
                  <div className="flex justify-between text-gray-400">
                    <span>Frais de livraison :</span>
                    <span>{deliveryFee.toLocaleString()} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Total :</span>
                  <span className="text-[#FF5A1F]">{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-6 rounded-full bg-[#FF5A1F] hover:bg-[#E04A15] text-white font-bold text-sm shadow-lg shadow-[#FF5A1F]/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Commander ({total.toLocaleString()} FCFA)</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
