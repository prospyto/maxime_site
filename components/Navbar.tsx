'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Menu as MenuIcon, X, ShoppingBag, Calendar } from 'lucide-react';

interface NavbarProps {
  onOpenReservation: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export default function Navbar({ onOpenReservation, onOpenCart, cartCount }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Highlight current section
      const sections = ['hero', 'philosophie', 'specialites', 'commander', 'contact'];
      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#hero', id: 'hero' },
    { name: 'À Propos', href: '#philosophie', id: 'philosophie' },
    { name: 'Menu', href: '#specialites', id: 'specialites' },
    { name: 'Commander', href: '#commander', id: 'commander' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0D0D0D]/95 backdrop-blur-md py-3 border-b border-white/10 shadow-2xl'
          : 'bg-[#0D0D0D]/80 backdrop-blur-sm py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 text-2xl font-extrabold text-white tracking-tight group"
            id="nav-logo"
          >
            <div className="w-10 h-10 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-[#FF5A1F] fill-[#FF5A1F]/20" />
            </div>
            <span className="font-sans">
              Ember <span className="text-[#FF5A1F]">Sushi</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" id="nav-desktop">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  activeSection === link.id
                    ? 'text-[#FF5A1F]'
                    : 'text-gray-300 hover:text-[#FF5A1F]'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions: Cart & Reservation CTA */}
          <div className="flex items-center gap-3">
            {/* Cart Icon Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 focus:outline-none"
              title="Voir mon panier"
              id="btn-cart-toggle"
            >
              <ShoppingBag className="w-5 h-5 text-gray-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5A1F] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Main Reservation CTA Button */}
            <button
              onClick={onOpenReservation}
              className="btn-shine hidden sm:inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#FF5A1F] hover:bg-[#E04A15] rounded-full transition-all duration-200 shadow-lg shadow-[#FF5A1F]/25 hover:shadow-[#FF5A1F]/40 hover:-translate-y-0.5 active:translate-y-0"
              id="btn-nav-reserve"
            >
              <Calendar className="w-4 h-4" />
              <span>Réserver une table</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Menu Mobile"
              id="btn-mobile-toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#FF5A1F]" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-white/10 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-semibold transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#FF5A1F]/10 text-[#FF5A1F]'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-base font-bold text-white bg-[#FF5A1F] hover:bg-[#E04A15] rounded-full transition-all"
            >
              <Calendar className="w-5 h-5" />
              <span>Réserver une table</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCart();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-base font-semibold text-gray-300 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10"
            >
              <ShoppingBag className="w-5 h-5 text-[#FF5A1F]" />
              <span>Mon Panier ({cartCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
