'use client';

import React from 'react';
import { Flame, Instagram, Facebook, Twitter, ArrowUp } from 'lucide-react';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const SOCIAL_DEFAULTS = {
  social_instagram_url: 'https://www.facebook.com/prospere.azonglahoun',
  social_facebook_url: 'https://www.facebook.com/prospere.azonglahoun',
  social_twitter_url: 'https://www.facebook.com/prospere.azonglahoun',
};

export default function Footer() {
  const content = useContentBlocks(SOCIAL_DEFAULTS);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0D0D0D] text-white pt-16 pb-10 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Logo */}
        <div className="inline-flex items-center gap-2.5 text-3xl font-extrabold text-white mb-3">
          <Flame className="w-8 h-8 text-[#FF5A1F] fill-[#FF5A1F]/30" />
          <span>Ember <span className="text-[#FF5A1F]">Sushi</span></span>
        </div>

        {/* Tagline */}
        <p className="text-gray-400 font-medium text-base mb-8 max-w-md mx-auto">
          L&apos;art du sushi, réinventé. Fraîcheur, créativité et haute gastronomie japonaise.
        </p>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <a
            href={content.social_instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-white/5"
            aria-label="Instagram Ember Sushi"
          >
            <Instagram className="w-5 h-5" />
          </a>

          <a
            href={content.social_facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-white/5"
            aria-label="Facebook Ember Sushi"
          >
            <Facebook className="w-5 h-5" />
          </a>

          <a
            href={content.social_twitter_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-white/5"
            aria-label="Twitter Ember Sushi"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        {/* Footer Bottom Row */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-400 gap-4">
          <p>&copy; 2026 Ember Sushi. Tous droits réservés.</p>

          <div className="flex items-center space-x-6">
            <a href="#hero" className="hover:text-[#FF5A1F] transition-colors">
              Mentions Légales
            </a>
            <span className="text-gray-600">|</span>
            <a href="#hero" className="hover:text-[#FF5A1F] transition-colors">
              Politique de Confidentialité
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-white/5 hover:bg-[#FF5A1F] text-gray-300 hover:text-white transition-all border border-white/10"
            title="Retour en haut"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
