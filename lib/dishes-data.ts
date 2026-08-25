export interface Dish {
  id: string;
  name: string;
  category: 'nigiri' | 'sashimi' | 'rolls' | 'chirashi' | 'signature';
  price: number; // in FCFA
  priceFormatted: string;
  description: string;
  pieces: string;
  image: string;
  rating: number;
  popular?: boolean;
  spicy?: boolean;
}

// Valeurs par défaut utilisées tant que la table Supabase `dishes` est vide
// ou inaccessible (voir hooks/useDishes.ts) — ne jamais casser l'affichage.
export const sampleDishes: Dish[] = [
  {
    id: '1',
    name: 'Saumon Nigiri Aburi',
    category: 'nigiri',
    price: 4500,
    priceFormatted: '4 500 FCFA',
    description: 'Nigiri au saumon atlantique légèrement flambé au chalumeau, huile de sésame et perles de caviar.',
    pieces: '6 pièces',
    image: '/images/sashimi_macro.webp',
    rating: 4.9,
    popular: true,
  },
  {
    id: '2',
    name: 'California Roll Signature',
    category: 'rolls',
    price: 5000,
    priceFormatted: '5 000 FCFA',
    description: 'Chair de crabe royal, avocat, concombre croquant et tobiko orange éclatant.',
    pieces: '8 pièces',
    image: '/images/sushi_rolls_macro.webp',
    rating: 4.8,
    popular: true,
  },
  {
    id: '3',
    name: 'Plateau Découverte Omakase',
    category: 'signature',
    price: 9500,
    priceFormatted: '9 500 FCFA',
    description: 'Assortiment d’exception : 4 Nigiri Saumon/Thon, 4 Sashimi et 4 Dragon Rolls flambés.',
    pieces: '12 pièces',
    image: '/images/hero_sushi_plate.webp',
    rating: 5.0,
    popular: true,
  },
  {
    id: '4',
    name: 'Sashimi Premium Thon & Saumon',
    category: 'sashimi',
    price: 6000,
    priceFormatted: '6 000 FCFA',
    description: 'Tranches épaisses de saumon d’Écosse et thon rouge de ligne, gingembre mariné artisanal.',
    pieces: '8 pièces',
    image: '/images/sushi_diagonal.webp',
    rating: 4.9,
    popular: true,
  },
  {
    id: '5',
    name: 'Dragon Roll Ember Flambé',
    category: 'rolls',
    price: 7500,
    priceFormatted: '7 500 FCFA',
    description: 'Crevette tempura croustillante, surmonté d’avocat fondant et saumon flambé à la sauce unagi.',
    pieces: '8 pièces',
    image: '/images/black_plate_leaf.webp',
    rating: 4.9,
    spicy: true,
  },
  {
    id: '6',
    name: 'Bol Chirashi Gourmand',
    category: 'chirashi',
    price: 8000,
    priceFormatted: '8 000 FCFA',
    description: 'Riz vinegre assaisonné couvert de dés de poissons crus, ikura, edamame et radis pickled.',
    pieces: '1 grand bol',
    image: '/images/sushi_bowl.webp',
    rating: 4.8,
  },
];
