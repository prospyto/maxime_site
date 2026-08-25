'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

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

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    avatar: row.avatar,
    rating: row.rating,
    date: row.review_date,
    comment: row.comment,
  };
}

// Avis par défaut tant que la table Supabase `reviews` est vide ou inaccessible —
// ne jamais casser l'affichage de la section Avis Clients.
export const defaultReviews: Review[] = [
  {
    id: '1',
    name: 'Jean-Marc K.',
    role: 'Gastronome Averti',
    avatar: 'JK',
    rating: 5,
    date: 'Il y a 2 jours',
    comment: 'Une fraîcheur absolue ! Le Saumon Nigiri Flambé est tout simplement le meilleur de la ville. Le cadre sombre et feutré ajoute une vraie touche de luxe.',
  },
  {
    id: '2',
    name: 'Sarah Benali',
    role: 'Cliente Régulière',
    avatar: 'SB',
    rating: 5,
    date: 'Il y a 1 semaine',
    comment: 'Commande livrée en 35 minutes, emballage zéro défaut et la température était parfaite. Les Dragon Rolls sont une tuerie !',
  },
  {
    id: '3',
    name: 'Alexandre V.',
    role: 'Critique Culinaire',
    avatar: 'AV',
    rating: 5,
    date: 'Il y a 2 semaines',
    comment: 'Ember Sushi surpasse les standards de la cuisine japonaise moderne. Le plateau Omakase est une œuvre d’art visuelle et gustative.',
  },
];

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      setReviews((data as ReviewRow[]).map(rowToReview));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    const channel = supabase
      .channel('reviews-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return { reviews, loading };
}
