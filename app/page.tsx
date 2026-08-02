'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import Specialties from '@/components/Specialties';
import OrderSection from '@/components/OrderSection';
import TabbedShowcase, { Dish, sampleDishes } from '@/components/TabbedShowcase';
import ContactMenuSection from '@/components/ContactMenuSection';
import Footer from '@/components/Footer';
import ReservationModal from '@/components/ReservationModal';
import OrderCartDrawer, { CartItem } from '@/components/OrderCartDrawer';
import DishDetailModal from '@/components/DishDetailModal';
import { ShoppingBag, Check } from 'lucide-react';

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (dish: Dish, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { dish, quantity }];
    });
    showToast(`${dish.name} ajouté au panier !`);
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (dishId: string) => {
    setCartItems((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const addedDishIds = cartItems.map((item) => item.dish.id);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white selection:bg-[#FF5A1F] selection:text-white font-sans antialiased relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-bold text-sm animate-in slide-in-from-bottom duration-300">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      {/* Hero Section */}
      <Hero onOpenReservation={() => setIsReservationOpen(true)} />

      {/* Philosophy Section (White background) */}
      <Philosophy />

      {/* Specialties Section (Dark background) */}
      <Specialties onSelectCategory={() => setIsCartOpen(true)} />

      {/* Order CTA Section (Dark background) */}
      <OrderSection
        onOpenOrderModal={() => setIsCartOpen(true)}
        onOpenReservationModal={() => setIsReservationOpen(true)}
      />

      {/* Tabbed Showcase (Floating Pill Container "Nos Plats", "Menu Populaire", "Avis Clients") */}
      <TabbedShowcase
        onAddToCart={(dish) => handleAddToCart(dish, 1)}
        onOpenDishDetail={(dish) => setSelectedDish(dish)}
        addedDishIds={addedDishIds}
      />

      {/* Contact & Popular Menu Section (White background) */}
      <ContactMenuSection
        onOpenOrderModal={() => setIsCartOpen(true)}
        onOpenReservationModal={() => setIsReservationOpen(true)}
      />

      {/* Footer (Dark background) */}
      <Footer />

      {/* Interactive Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* Interactive Order Cart Drawer */}
      <OrderCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Interactive Dish Detail Modal */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={(dish, qty) => {
          handleAddToCart(dish, qty);
          setSelectedDish(null);
        }}
        isAdded={selectedDish ? addedDishIds.includes(selectedDish.id) : false}
      />

    </div>
  );
}
