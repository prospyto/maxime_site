'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Dish, sampleDishes } from '@/lib/dishes-data';

interface DishRow {
  id: string;
  name: string;
  category: Dish['category'];
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

function rowToDish(row: DishRow): Dish {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    priceFormatted: row.price_formatted,
    description: row.description,
    pieces: row.pieces,
    image: row.image,
    rating: row.rating,
    popular: row.popular,
    spicy: row.spicy,
  };
}

// Charge les plats depuis Supabase. Si la table est vide ou inaccessible,
// on retombe sur sampleDishes pour ne jamais casser l'affichage du site.
export function useDishes() {
  const [dishes, setDishes] = useState<Dish[]>(sampleDishes);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      setDishes((data as DishRow[]).map(rowToDish));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('display_order', { ascending: true });

      if (!ignore) {
        if (!error && data && data.length > 0) {
          setDishes((data as DishRow[]).map(rowToDish));
        }
        setLoading(false);
      }
    }
    init();

    const channel = supabase
      .channel('dishes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dishes' }, () => {
        load();
      })
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, [load]);

  return { dishes, loading };
}
