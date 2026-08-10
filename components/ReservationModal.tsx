'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, User, Phone, CheckCircle, Flame } from 'lucide-react';
import { useAntiBot } from '../hooks/useAntiBot';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: '2',
    name: '',
    phone: '',
    notes: '',
  });
  const [bookingCode, setBookingCode] = useState('');
  const { honeypotProps, isLikelyBot, reset: resetAntiBot } = useAntiBot(2);

  useEffect(() => {
    if (isOpen) resetAntiBot();
  }, [isOpen, resetAntiBot]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLikelyBot()) {
      // Silently pretend it worked so bots don't retry with different tactics —
      // no real reservation is created, and no error hints at the detection.
      setStep('success');
      return;
    }
    const randomCode = 'EMB-' + Math.floor(1000 + Math.random() * 9000);
    setBookingCode(randomCode);
    setStep('success');
  };

  const handleReset = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121212] text-white w-full max-w-lg max-h-[92vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] shrink-0">
              <Flame className="w-5 h-5 fill-[#FF5A1F]/30" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">Réserver une Table</h3>
              <p className="text-xs text-gray-400 truncate">Ember Sushi • Confirmation immédiate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field: invisible to humans, tempting to bots. Do not remove. */}
              <input type="text" {...honeypotProps} />
              
              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FF5A1F]" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" /> Heure
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#FF5A1F] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F] transition-colors"
                  >
                    <option value="12:00">12:00 - Déjeuner</option>
                    <option value="13:00">13:00 - Déjeuner</option>
                    <option value="19:00">19:00 - Dîner</option>
                    <option value="19:30">19:30 - Dîner</option>
                    <option value="20:30">20:30 - Dîner</option>
                    <option value="21:30">21:30 - Dîner</option>
                  </select>
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#FF5A1F]" /> Nombre de Couverts
                </label>
                <div className="grid grid-cols-3 xs:grid-cols-5 sm:grid-cols-5 gap-2">
                  {['1', '2', '4', '6', '8+'].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setFormData({ ...formData, guests: num })}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all whitespace-nowrap ${
                        formData.guests === num
                          ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                          : 'bg-[#1A1A1A] text-gray-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {num} pers.
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FF5A1F]" /> Nom Complet
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Alexandre Dubois"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FF5A1F]" /> Téléphone Mobile (pour SMS de confirmation)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="ex: +33 6 12 34 56 78 / +225 07 00 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Demande Particulière (optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="ex: Table calme, anniversaire, allergies..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-shine w-full mt-2 py-3.5 px-6 rounded-full bg-[#FF5A1F] hover:bg-[#E04A15] text-white font-bold text-sm shadow-lg shadow-[#FF5A1F]/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Confirmer ma Réservation</span>
              </button>
            </form>
          ) : (
            /* Success View */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-extrabold text-white">Réservation Confirmée !</h4>
                <p className="text-xs text-gray-400">Nous sommes impatients de vous accueillir chez Ember Sushi.</p>
              </div>

              <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/10 space-y-2 text-sm text-left">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Code de Réservation :</span>
                  <span className="font-mono font-extrabold text-[#FF5A1F]">{bookingCode}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Client :</span>
                  <span className="font-semibold text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Date & Heure :</span>
                  <span className="font-semibold text-white">{formData.date} à {formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Couverts :</span>
                  <span className="font-semibold text-white">{formData.guests} personnes</span>
                </div>
              </div>

              <p className="text-xs text-gray-500">Un SMS de confirmation a été envoyé au {formData.phone}.</p>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors"
              >
                Fermer
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
