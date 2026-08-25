'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Loader2, Save, Star, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReviewRow {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  review_date: string;
  comment: string;
  display_order: number;
}

const EMPTY_REVIEW: Omit<ReviewRow, 'id'> = {
  name: '',
  role: '',
  avatar: '',
  rating: 5,
  review_date: '',
  comment: '',
  display_order: 0,
};

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<ReviewRow, 'id'>>(EMPTY_REVIEW);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('display_order', { ascending: true });
    if (data) setReviews(data as ReviewRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .order('display_order', { ascending: true });
      if (!ignore) {
        if (data) setReviews(data as ReviewRow[]);
        setLoading(false);
      }
    }
    init();

    const channel = supabase
      .channel('admin-reviews-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
        load();
      })
      .subscribe();
    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, [load]);

  const startEdit = (review: ReviewRow) => {
    setEditingId(review.id);
    setCreating(false);
    const { id, ...rest } = review;
    setDraft(rest);
  };

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setDraft({ ...EMPTY_REVIEW, display_order: reviews.length + 1 });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCreating(false);
    setDraft(EMPTY_REVIEW);
  };

  const saveDraft = async () => {
    if (!draft.name.trim() || !draft.comment.trim()) {
      alert('Le nom et le commentaire sont requis.');
      return;
    }
    setSaving(true);

    const payload = {
      ...draft,
      avatar: draft.avatar || draft.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      updated_at: new Date().toISOString(),
    };

    if (creating) {
      const { error } = await supabase.from('reviews').insert(payload);
      if (error) alert("Erreur à la création : " + error.message);
    } else if (editingId) {
      const { error } = await supabase.from('reviews').update(payload).eq('id', editingId);
      if (error) alert("Erreur à la sauvegarde : " + error.message);
    }

    setSaving(false);
    cancelEdit();
    load();
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Supprimer cet avis définitivement ?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    setDeletingId(null);
    if (error) alert('Erreur à la suppression : ' + error.message);
    load();
  };

  const isFormOpen = creating || editingId !== null;

  return (
    <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white">Avis Clients</h2>
          <p className="text-xs text-gray-500 mt-1">
            Ajoute, modifie ou supprime les témoignages affichés dans l&apos;onglet &quot;Avis Clients&quot;.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04A15] text-white text-sm font-bold transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Nouvel avis
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="p-6 border-b border-white/8 bg-[#1A1A1A] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">{creating ? 'Nouvel avis' : 'Modifier l\'avis'}</h3>
            <button onClick={cancelEdit} className="text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400">Nom du client</label>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400">Rôle / titre</label>
              <input
                type="text"
                value={draft.role}
                onChange={(e) => setDraft((p) => ({ ...p, role: e.target.value }))}
                placeholder="ex. Cliente Régulière"
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400">Date affichée</label>
              <input
                type="text"
                value={draft.review_date}
                onChange={(e) => setDraft((p) => ({ ...p, review_date: e.target.value }))}
                placeholder="ex. Il y a 2 jours"
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400">Note (1 à 5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={draft.rating}
                onChange={(e) => setDraft((p) => ({ ...p, rating: Number(e.target.value) }))}
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-gray-400">Commentaire</label>
              <textarea
                value={draft.comment}
                onChange={(e) => setDraft((p) => ({ ...p, comment: e.target.value }))}
                rows={3}
                className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F] resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={saveDraft}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5A1F] hover:bg-[#E04A15] disabled:opacity-50 text-white text-sm font-bold transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {creating ? 'Créer l\'avis' : 'Enregistrer'}
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

      <div className="divide-y divide-white/8">
        {loading ? (
          <div className="p-8 flex items-center justify-center text-gray-500 text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Chargement des avis…
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Aucun avis pour l&apos;instant. Le site affiche les avis par défaut tant que cette liste est vide.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FF5A1F] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                {review.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{review.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{review.role}</span>
                  <span>•</span>
                  <span>{review.review_date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {review.rating}/5
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{review.comment}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEdit(review)}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  disabled={deletingId === review.id}
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-colors disabled:opacity-50"
                >
                  {deletingId === review.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
