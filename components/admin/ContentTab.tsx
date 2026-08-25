'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Type, Save, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Block {
  key: string;
  value: string;
  type: string;
}

const HERO_KEYS = ['hero_title_line1', 'hero_title_highlight', 'hero_subtitle', 'hero_image'];

const LABELS: Record<string, string> = {
  hero_title_line1: 'Titre — première ligne',
  hero_title_highlight: 'Titre — ligne en surbrillance',
  hero_subtitle: 'Sous-titre',
  hero_image: 'Image de fond',
};

export default function ContentTab() {
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('content_blocks')
      .select('key, value')
      .in('key', HERO_KEYS);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `hero/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('site-content')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      alert("Erreur d'upload : " + uploadError.message + " — vérifie que le bucket 'site-content' existe et est public.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('site-content').getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    setBlocks((prev) => ({ ...prev, hero_image: publicUrl }));

    await supabase
      .from('content_blocks')
      .update({ value: publicUrl, updated_at: new Date().toISOString() })
      .eq('key', 'hero_image');

    setUploading(false);
    setSaved('hero_image');
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-bold text-white">Section Accueil (Hero)</h2>
          <p className="text-xs text-gray-500 mt-1">
            Modifie le texte et l'image affichés en haut du site. Les changements sont visibles immédiatement après enregistrement.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Textes */}
          {(['hero_title_line1', 'hero_title_highlight', 'hero_subtitle'] as const).map((key) => (
            <div key={key} className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
                <Type className="w-3.5 h-3.5" /> {LABELS[key]}
              </label>
              <div className="flex gap-2">
                {key === 'hero_subtitle' ? (
                  <textarea
                    value={blocks[key] || ''}
                    onChange={(e) => setBlocks((p) => ({ ...p, [key]: e.target.value }))}
                    rows={3}
                    className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5A1F] resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={blocks[key] || ''}
                    onChange={(e) => setBlocks((p) => ({ ...p, [key]: e.target.value }))}
                    className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5A1F]"
                  />
                )}
                <button
                  onClick={() => saveBlock(key)}
                  disabled={saving === key}
                  className="shrink-0 w-11 h-11 rounded-xl bg-[#FF5A1F] hover:bg-[#E04A15] disabled:opacity-50 flex items-center justify-center transition-colors"
                >
                  {saving === key ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : saved === key ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Save className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          ))}

          {/* Image */}
          <div className="space-y-2 pt-2 border-t border-white/8">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
              <ImageIcon className="w-3.5 h-3.5" /> Image de fond
            </label>
            {blocks.hero_image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={blocks.hero_image} alt="Aperçu" className="w-full max-w-sm h-32 object-cover rounded-xl border border-white/10" />
            )}
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 hover:border-[#FF5A1F] text-sm text-gray-300 cursor-pointer transition-colors">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…
                </>
              ) : saved === 'hero_image' ? (
                <>
                  <Check className="w-4 h-4 text-[#FF5A1F]" /> Image mise à jour
                </>
              ) : (
                <>Choisir une nouvelle image…</>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600">
        D'autres sections (Menu, À propos…) seront ajoutées ici progressivement.
      </p>
    </div>
  );
}
