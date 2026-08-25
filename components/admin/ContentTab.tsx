'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Type, Save, Check, Loader2, Pencil } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DishesTab from '@/components/admin/DishesTab';
import ReviewsTab from '@/components/admin/ReviewsTab';

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
const SHOWCASE_KEYS = [
  'showcase_plats_title', 'showcase_plats_subtitle',
  'showcase_populaire_badge', 'showcase_populaire_title', 'showcase_populaire_subtitle',
  'showcase_avis_badge', 'showcase_avis_title', 'showcase_avis_subtitle',
];
const CONTACT_KEYS = [
  'contact_badge', 'contact_title', 'contact_subtitle', 'contact_image',
  'contact_feature1_label', 'contact_feature1_text',
  'contact_feature2_label', 'contact_feature2_text',
  'contact_feature3_label', 'contact_feature3_text',
  'contact_feature4_label', 'contact_feature4_text',
  'contact_feature5_label', 'contact_feature5_text',
];
const SOCIAL_KEYS = ['social_instagram_url', 'social_facebook_url', 'social_twitter_url'];
const FORM_KEYS = ['form_reservation_title', 'form_reservation_subtitle', 'form_commande_title'];
const ALL_KEYS = [
  ...HERO_KEYS, ...PHILO_KEYS, ...SPEC_KEYS,
  ...SHOWCASE_KEYS, ...CONTACT_KEYS, ...SOCIAL_KEYS, ...FORM_KEYS,
];

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
  showcase_plats_title: 'Titre — onglet "Nos Plats"',
  showcase_plats_subtitle: 'Sous-titre — onglet "Nos Plats"',
  showcase_populaire_badge: 'Badge — onglet "Menu Populaire"',
  showcase_populaire_title: 'Titre — onglet "Menu Populaire"',
  showcase_populaire_subtitle: 'Sous-titre — onglet "Menu Populaire"',
  showcase_avis_badge: 'Badge — onglet "Avis Clients"',
  showcase_avis_title: 'Titre — onglet "Avis Clients"',
  showcase_avis_subtitle: 'Sous-titre — onglet "Avis Clients"',
  contact_badge: 'Badge (au-dessus du titre)',
  contact_title: 'Titre de section',
  contact_subtitle: 'Sous-titre de section',
  contact_image: 'Photo de la section',
  contact_feature1_label: 'Info 1 — Libellé',
  contact_feature1_text: 'Info 1 — Texte',
  contact_feature2_label: 'Info 2 — Libellé',
  contact_feature2_text: 'Info 2 — Texte',
  contact_feature3_label: 'Info 3 — Libellé',
  contact_feature3_text: 'Info 3 — Texte',
  contact_feature4_label: 'Info 4 — Libellé',
  contact_feature4_text: 'Info 4 — Texte',
  contact_feature5_label: 'Info 5 — Libellé',
  contact_feature5_text: 'Info 5 — Texte',
  social_instagram_url: 'Lien Instagram',
  social_facebook_url: 'Lien Facebook',
  social_twitter_url: 'Lien Twitter / X',
  form_reservation_title: 'Titre — formulaire de réservation',
  form_reservation_subtitle: 'Sous-titre — formulaire de réservation',
  form_commande_title: 'Titre — formulaire de commande',
};

const LONG_TEXT_KEYS = new Set([
  'hero_subtitle', 'philo_subtitle', 'philo_card1_text', 'philo_card2_text',
  'spec_subtitle', 'spec_card1_text', 'spec_card2_text', 'spec_card3_text',
  'showcase_plats_subtitle', 'showcase_populaire_subtitle', 'showcase_avis_subtitle',
  'contact_subtitle',
]);

export default function ContentTab() {
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [editingKeys, setEditingKeys] = useState<Set<string>>(new Set());

  const startEditing = (key: string) => {
    setEditingKeys((prev) => new Set(prev).add(key));
  };

  const stopEditing = (key: string) => {
    setEditingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

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
      stopEditing(key);
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

  const TextField = ({ fieldKey }: { fieldKey: string }) => {
    const isEditing = editingKeys.has(fieldKey);

    if (!isEditing) {
      return (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
            <Type className="w-3.5 h-3.5" /> {LABELS[fieldKey]}
          </label>
          <div className="flex gap-2">
            <div className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-gray-200 min-h-[44px] flex items-center">
              {blocks[fieldKey] || <span className="text-gray-600">Vide</span>}
            </div>
            <button
              onClick={() => startEditing(fieldKey)}
              className="shrink-0 flex items-center gap-2 px-4 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold transition-colors"
            >
              <Pencil className="w-4 h-4" /> Modifier
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
          <Type className="w-3.5 h-3.5" /> {LABELS[fieldKey]}
        </label>
        <div className="flex gap-2">
          {LONG_TEXT_KEYS.has(fieldKey) ? (
            <textarea
              autoFocus
              value={blocks[fieldKey] || ''}
              onChange={(e) => setBlocks((p) => ({ ...p, [fieldKey]: e.target.value }))}
              rows={3}
              className="flex-1 bg-[#1A1A1A] border border-[#FF5A1F] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none resize-none"
            />
          ) : (
            <input
              autoFocus
              type="text"
              value={blocks[fieldKey] || ''}
              onChange={(e) => setBlocks((p) => ({ ...p, [fieldKey]: e.target.value }))}
              className="flex-1 bg-[#1A1A1A] border border-[#FF5A1F] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
            />
          )}
          <button
            onClick={() => saveBlock(fieldKey)}
            disabled={saving === fieldKey}
            className="shrink-0 w-11 h-11 rounded-xl bg-[#FF5A1F] hover:bg-[#E04A15] disabled:opacity-50 flex items-center justify-center transition-colors"
            title="Valider"
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
  };

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

      {/* Section En-têtes "Nos Plats" / "Menu Populaire" */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-bold text-white">En-têtes "Nos Plats" &amp; "Menu Populaire"</h2>
          <p className="text-xs text-gray-500 mt-1">
            Titres et sous-titres affichés au-dessus de la grille de plats et de la liste populaire.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <TextField fieldKey="showcase_plats_title" />
          <TextField fieldKey="showcase_plats_subtitle" />
          <TextField fieldKey="showcase_populaire_badge" />
          <TextField fieldKey="showcase_populaire_title" />
          <TextField fieldKey="showcase_populaire_subtitle" />
        </div>
      </div>

      {/* Section Plats */}
      <DishesTab />

      {/* Section Avis Clients */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-bold text-white">En-tête "Avis Clients"</h2>
          <p className="text-xs text-gray-500 mt-1">
            Badge, titre et sous-titre affichés au-dessus des témoignages.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <TextField fieldKey="showcase_avis_badge" />
          <TextField fieldKey="showcase_avis_title" />
          <TextField fieldKey="showcase_avis_subtitle" />
        </div>
      </div>

      <ReviewsTab />

      {/* Section Contact */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-bold text-white">Section Contact</h2>
          <p className="text-xs text-gray-500 mt-1">
            Badge, titre, sous-titre, photo et les 5 informations pratiques (adresse, livraison…).
          </p>
        </div>
        <div className="p-6 space-y-6">
          <TextField fieldKey="contact_badge" />
          <TextField fieldKey="contact_title" />
          <TextField fieldKey="contact_subtitle" />
          <ImageField fieldKey="contact_image" />
          <TextField fieldKey="contact_feature1_label" />
          <TextField fieldKey="contact_feature1_text" />
          <TextField fieldKey="contact_feature2_label" />
          <TextField fieldKey="contact_feature2_text" />
          <TextField fieldKey="contact_feature3_label" />
          <TextField fieldKey="contact_feature3_text" />
          <TextField fieldKey="contact_feature4_label" />
          <TextField fieldKey="contact_feature4_text" />
          <TextField fieldKey="contact_feature5_label" />
          <TextField fieldKey="contact_feature5_text" />
        </div>
      </div>

      {/* Section Réseaux sociaux */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-bold text-white">Réseaux sociaux</h2>
          <p className="text-xs text-gray-500 mt-1">
            Liens des icônes affichées en bas de page (pied de page).
          </p>
        </div>
        <div className="p-6 space-y-6">
          <TextField fieldKey="social_instagram_url" />
          <TextField fieldKey="social_facebook_url" />
          <TextField fieldKey="social_twitter_url" />
        </div>
      </div>

      {/* Section Formulaires */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="font-bold text-white">Formulaires</h2>
          <p className="text-xs text-gray-500 mt-1">
            Titres affichés en haut des formulaires de réservation et de commande.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <TextField fieldKey="form_reservation_title" />
          <TextField fieldKey="form_reservation_subtitle" />
          <TextField fieldKey="form_commande_title" />
        </div>
      </div>

      <p className="text-xs text-gray-600">
        D'autres ajustements pourront être ajoutés ici progressivement.
      </p>
    </div>
  );
}
