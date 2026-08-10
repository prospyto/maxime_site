import Link from 'next/link';
import { Flame, Home, UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center mx-auto text-[#FF5A1F]">
          <UtensilsCrossed className="w-10 h-10" />
        </div>

        {/* Code */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-[#FF5A1F] uppercase tracking-widest">
            Erreur 404
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Cette page n&apos;est pas au menu
          </h1>
          <p className="text-base text-gray-400 leading-relaxed max-w-md mx-auto">
            La page que vous cherchez a peut-être été déplacée, renommée, ou n&apos;a jamais existé. Retournez à l&apos;accueil pour découvrir nos créations.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-[#FF5A1F] hover:bg-[#E04A15] rounded-full transition-all duration-300 shadow-lg shadow-[#FF5A1F]/30 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>
          <Link
            href="/#specialites"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-gray-200 bg-white/5 hover:bg-white/10 rounded-full border border-white/15 transition-all duration-300"
          >
            <Flame className="w-4 h-4 text-[#FF5A1F]" />
            <span>Voir nos spécialités</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
