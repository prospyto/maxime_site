'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for future debugging / monitoring integration
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-10 h-10" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-[#FF5A1F] uppercase tracking-widest">
            Une erreur est survenue
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Oups, quelque chose s&apos;est mal passé
          </h1>
          <p className="text-base text-gray-400 leading-relaxed max-w-md mx-auto">
            Nos chefs travaillent déjà à résoudre le problème. Vous pouvez réessayer, ou revenir à l&apos;accueil en attendant.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-600 font-mono pt-1">
              Référence : {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-[#FF5A1F] hover:bg-[#E04A15] rounded-full transition-all duration-300 shadow-lg shadow-[#FF5A1F]/30 hover:-translate-y-0.5"
          >
            <RotateCw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-gray-200 bg-white/5 hover:bg-white/10 rounded-full border border-white/15 transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
