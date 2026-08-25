'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Loader2, Check, Save, ImageIcon, Star, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DishRow {
  id: string;
  name: string;
  category: string;
  price: number;
  price_formatted: string;
  description: string;
  pieces: string;
  image: string;
  rating: number;
  popular: boolean;
  spicy: boolean;
  display_order: number;
}

const CATEGORIES = [
  { value: 'nigiri', label: 'Nigiri' },
  { value: 'sashimi', label: 'Sashimi' },
  { value: 'rolls', label: 'Rolls' },
  { value: 'chirashi', label: 'Chirashi' },
  { value: 'signature', label: 'Signature' },
];

const EMPTY_DISH: Omit<DishRow, 'id'> = {
  name: '',
  category: 'signature',
  price: 0,
  price_formatted: '',
  description: '',
  pieces: '',
  image: '',
  rating: 5,
  popular: false,
  spicy: false,
  display_order: 0,
};

export default function DishesTab() {
  const [dishes, setDishes] = useState<DishRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<DishRow, 'id'>>(EMPTY_DISH);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('dishes')
      .select('*')
      .order('display_order', { ascending: true });
    if (data) setDishes(data as DishRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel('admin-dishes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dishes' }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const startEdit = (dish: DishRow) => {
    setEditingId(dish.id);
    setCreating(false);
    const { id, ...rest } = dish;
    setDraft(rest);
  };

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setDraft({ ...EMPTY_DISH, display_order: dishes.length + 1 });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCreating(false);
    setDraft(EMPTY_DISH);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `dishes/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('site-content')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      alert("Erreur d'upload : " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('site-content').getPublicUrl(path);
    setDraft((prev) => ({ ...prev, image: urlData.publicUrl }));
    setUploading(false);
  };

  const saveDraft = async () => {
    if (!draft.name.trim()) {
      alert('Le nom du plat est requis.');
      return;
    }
    setSaving(true);

    const payload = {
      ...draft,
      price_formatted: draft.price_formatted || `${draft.price.toLocaleString('fr-FR')} FCFA`,
      updated_at: new Date().toISOString(),
    };

    if (creating) {
      const { error } = await supabase.from('dishes').insert(payload);
      if (error) alert("Erreur à la création : " + error.message);
    } else if (editingId) {
      const { error } = await supabase.from('dishes').update(payload).eq('id', editingId);
      if (error) alert("Erreur à la sauvegarde : " + error.message);
    }

    setSaving(false);
    cancelEdit();
    load();
  };

  const deleteDish = async (id: string) => {
    if (!confirm('Supprimer ce plat définitivement ?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('dishes').delete().eq('id', id);
    setDeletingId(null);
    if (error) alert('Erreur à la suppression : ' + error.message);
    load();
  };

  const isFormOpen = creating || editingId !== null;

  return (
    <div className="space-y-6">
      <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white">Plats du menu</h2>
            <p className="text-xs text-gray-500 mt-1">
              Ajoute, modifie ou supprime les plats affichés dans &quot;Nos Plats&quot; et &quot;Menu Populaire&quot;.
            </p>
          </div>
          {!isFormOpen && (
            <button
              onClick={startCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04A15] text-white text-sm font-bold transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> Nouveau plat
            </button>
          )}
        </div>

        {/* Formulaire création / édition */}
        {isFormOpen && (
          <div className="p-6 border-b border-white/8 bg-[#1A1A1A] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {creating ? 'Nouveau plat' : 'Modifier le plat'}
              </h3>
              <button onClick={cancelEdit} className="text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">Nom du plat</label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">Catégorie</label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">Prix (FCFA)</label>
                <input
                  type="number"
                  value={draft.price}
                  onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value) }))}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">Nombre de pièces</label>
                <input
                  type="text"
                  value={draft.pieces}
                  onChange={(e) => setDraft((p) => ({ ...p, pieces: e.target.value }))}
                  placeholder="ex. 8 pièces"
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-gray-400">Description</label>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">Note (/5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={draft.rating}
                  onChange={(e) => setDraft((p) => ({ ...p, rating: Number(e.target.value) }))}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="flex items-end gap-6 pb-1">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.popular}
                    onChange={(e) => setDraft((p) => ({ ...p, popular: e.target.checked }))}
                    className="accent-[#FF5A1F] w-4 h-4"
                  />
                  Populaire
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.spicy}
                    onChange={(e) => setDraft((p) => ({ ...p, spicy: e.target.checked }))}
                    className="accent-[#FF5A1F] w-4 h-4"
                  />
                  Épicé
                </label>
              </div>

              <div className="space-y-2 sm:col-span-2 pt-2 border-t border-white/8">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <ImageIcon className="w-3.5 h-3.5" /> Image du plat
                </label>
                {draft.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={draft.image} alt="Aperçu" className="w-full max-w-xs h-32 object-cover rounded-xl border border-white/10" />
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-white/10 hover:border-[#FF5A1F] text-sm text-gray-300 cursor-pointer transition-colors">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…
                    </>
                  ) : (
                    <>Choisir une image…</>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={saveDraft}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04A15] disabled:opacity-50 text-white text-sm font-bold transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {creating ? 'Créer le plat' : 'Enregistrer'}
              </button>
              <button
                onClick={cancelEdit}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste des plats */}
        <div className="divide-y divide-white/8">
          {loading ? (
            <div className="p-8 flex items-center justify-center text-gray-500 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Chargement des plats…
            </div>
          ) : dishes.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Aucun plat pour l&apos;instant. Le site affiche les plats par défaut tant que cette liste est vide.
            </div>
          ) : (
            dishes.map((dish) => (
              <div key={dish.id} className="p-4 flex items-center gap-4">
                {dish.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={dish.image} alt={dish.name} className="w-14 h-14 object-cover rounded-lg border border-white/10 shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white truncate">{dish.name}</h4>
                    {dish.popular && (
                      <span className="text-[10px] font-bold text-[#FF5A1F] bg-[#FF5A1F]/10 px-2 py-0.5 rounded-full">Populaire</span>
                    )}
                    {dish.spicy && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">Épicé</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                    <span className="capitalize">{dish.category}</span>
                    <span>•</span>
                    <span>{dish.price_formatted}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {dish.rating}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(dish)}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteDish(dish.id)}
                    disabled={deletingId === dish.id}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-colors disabled:opacity-50"
                  >
                    {deletingId === dish.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
