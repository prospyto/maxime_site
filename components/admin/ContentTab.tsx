'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Type, Save, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DishesTab from '@/components/admin/DishesTab';

interface Block {
  key: string;
  value: string;
  type: string;
}

const HERO_KEYS = ['hero_title_line1', 'hero_title_highlight', 'hero_subtitle', 'hero_image'];
const PHILO_KEYS = [
  'philo_badge', 'philo_title', 'philo_subtitle',
  'philo_card1_title', 'philo_card1_text',
  'philo_card2_title', 'philo_card2_text',
  'philo_image1', 'philo_image2',
];
const SPEC_KEYS = [
  'spec_badge', 'spec_title', 'spec_subtitle',
  'spec_card1_title', 'spec_card1_text',
  'spec_card2_title', 'spec_card2_text',
  'spec_card3_title', 'spec_card3_text',
  'spec_image',
];
const ALL_KEYS = [...HERO_KEYS, ...PHILO_KEYS, ...SPEC_KEYS];

const LABELS: Record<string, string> = {
  hero_title_line1: 'Titre — première ligne',
  hero_title_highlight: 'Titre — ligne en surbrillance',
  hero_subtitle: 'Sous-titre',
  hero_image: 'Image de fond',
  philo_badge: 'Badge (au-dessus du titre)',
  philo_title: 'Titre de section',
  philo_subtitle: 'Sous-titre de section',
  philo_card1_title: 'Carte 1 — Titre',
  philo_card1_text: 'Carte 1 — Texte',
  philo_card2_title: 'Carte 2 — Titre',
  philo_card2_text: 'Carte 2 — Texte',
  philo_image1: 'Image de gauche',
  philo_image2: 'Image de droite',
  spec_badge: 'Badge (au-dessus du titre)',
  spec_title: 'Titre de section',
  spec_subtitle: 'Sous-titre de section',
  spec_card1_title: 'Carte 1 — Titre',
  spec_card1_text: 'Carte 1 — Texte',
  spec_card2_title: 'Carte 2 — Titre',
  spec_card2_text: 'Carte 2 — Texte',
  spec_card3_title: 'Carte 3 — Titre',
  spec_card3_text: 'Carte 3 — Texte',
  spec_image: 'Image (carte du milieu)',
};

const LONG_TEXT_KEYS = new Set([
  'hero_subtitle', 'philo_subtitle', 'philo_card1_text', 'philo_card2_text',
  'spec_subtitle', 'spec_card1_text', 'spec_card2_text', 'spec_card3_text',
]);

export default function ContentTab() {
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('content_blocks')
      .select('key, value')
      .in('key', ALL_KEYS);
    if (data) {
      const map: Record<string, string> = {};
      for (const b of data as Block[]) map[b.key] = b.value;
      setBlocks(map);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveBlock = async (key: string) => {
    setSaving(key);
    const { error } = await supabase
      .from('content_blocks')
      .update({ value: blocks[key], updated_at: new Date().toISOString() })
      .eq('key', key);
    setSaving(null);
    if (!error) {
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    }
  };

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(key);

    const ext = file.name.split('.').pop();
    const path = `${key}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('site-content')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      alert("Erreur d'upload : " + uploadError.message + " — vérifie que le bucket 'site-content' existe et est public.");
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from('site-content').getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    setBlocks((prev) => ({ ...prev, [key]: publicUrl }));

    await supabase
      .from('content_blocks')
      .update({ value: publicUrl, updated_at: new Date().toISOString() })
      .eq('key', key);

    setUploading(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  const TextField = ({ fieldKey }: { fieldKey: string }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
        <Type className="w-3.5 h-3.5" /> {LABELS[fieldKey]}
      </label>
      <div className="flex gap-2">
        {LONG_TEXT_KEYS.has(fieldKey) ? (
          <textarea
            value={blocks[fieldKey] || ''}
            onChange={(e) => setBlocks((p) => ({ ...p, [fieldKey]: e.target.value }))}
            rows={3}
            className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5A1F] resize-none"
          />
        ) : (
          <input
            type="text"
            value={blocks[fieldKey] || ''}
            onChange={(e) => setBlocks((p) => ({ ...p, [fieldKey]: e.target.value }))}
            className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5A1F]"
          />
        )}
        <button
          onClick={() => saveBlock(fieldKey)}
          disabled={saving === fieldKey}
          className="shrink-0 w-11 h-11 rounded-xl bg-[#FF5A1F] hover:bg-[#E04A15] disabled:opacity-50 flex items-center justify-center transition-colors"
        >
          {saving === fieldKey ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : saved === fieldKey ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Save className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </div>
  );

  const ImageField = ({ fieldKey }: { fieldKey: string }) => (
    <div className="space-y-2 pt-2 border-t border-white/8">
      <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
        <ImageIcon className="w-3.5 h-3.5" /> {LABELS[fieldKey]}
      </label>
      {blocks[fieldKey] && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={blocks[fieldKey]} alt="Aperçu" className="w-full max-w-sm h-32 object-cover rounded-xl border border-white/10" />
      )}
      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 hover:border-[#FF5A1F] text-sm text-gray-300 cursor-pointer transition-colors">
        {uploading === fieldKey ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…
          </>
        ) : saved === fieldKey ? (
          <>
            <Check className="w-4 h-4 text-[#FF5A1F]" /> Image mise à jour
          </>
        ) : (
          <>Choisir une nouvelle image…</>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(fieldKey, e)}
          className="hidden"
          disabled={uploading === fieldKey}
        />
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Hero */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-bold text-white">Section Accueil (Hero)</h2>
          <p className="text-xs text-gray-500 mt-1">
            Modifie le texte et l'image affichés en haut du site.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <TextField fieldKey="hero_title_line1" />
          <TextField fieldKey="hero_title_highlight" />
          <TextField fieldKey="hero_subtitle" />
          <ImageField fieldKey="hero_image" />
        </div>
      </div>

      {/* Section Philosophie */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-bold text-white">Section Philosophie</h2>
          <p className="text-xs text-gray-500 mt-1">
            Titre, sous-titre, les deux cartes et les deux images de la section.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <TextField fieldKey="philo_badge" />
          <TextField fieldKey="philo_title" />
          <TextField fieldKey="philo_subtitle" />
          <TextField fieldKey="philo_card1_title" />
          <TextField fieldKey="philo_card1_text" />
          <TextField fieldKey="philo_card2_title" />
          <TextField fieldKey="philo_card2_text" />
          <ImageField fieldKey="philo_image1" />
          <ImageField fieldKey="philo_image2" />
        </div>
      </div>

      {/* Section Spécialités */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-bold text-white">Section Spécialités</h2>
          <p className="text-xs text-gray-500 mt-1">
            Badge, titre, sous-titre, les 3 cartes catégories et l'image du menu.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <TextField fieldKey="spec_badge" />
          <TextField fieldKey="spec_title" />
          <TextField fieldKey="spec_subtitle" />
          <TextField fieldKey="spec_card1_title" />
          <TextField fieldKey="spec_card1_text" />
          <TextField fieldKey="spec_card2_title" />
          <TextField fieldKey="spec_card2_text" />
          <TextField fieldKey="spec_card3_title" />
          <TextField fieldKey="spec_card3_text" />
          <ImageField fieldKey="spec_image" />
        </div>
      </div>

      {/* Section Plats */}
      <DishesTab />

      <p className="text-xs text-gray-600">
        D'autres sections (Contact…) seront ajoutées ici progressivement.
      </p>
    </div>
  );
}
