import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Mock in-memory store for development/preview when Supabase credentials are not configured
const initialDishes = [
  {
    id: '1',
    name: 'Saumon Nigiri Aburi',
    category: 'nigiri',
    price: 4500,
    price_formatted: '4 500 FCFA',
    description: 'Nigiri au saumon atlantique légèrement flambé au chalumeau, huile de sésame et perles de caviar.',
    pieces: '6 pièces',
    image: '/images/sashimi_macro.webp',
    rating: 4.9,
    popular: true,
    spicy: false,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'California Roll Signature',
    category: 'rolls',
    price: 5000,
    price_formatted: '5 000 FCFA',
    description: 'Chair de crabe royal, avocat, concombre croquant et tobiko orange éclatant.',
    pieces: '8 pièces',
    image: '/images/sushi_rolls_macro.webp',
    rating: 4.8,
    popular: true,
    spicy: false,
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Plateau Découverte Omakase',
    category: 'signature',
    price: 9500,
    price_formatted: '9 500 FCFA',
    description: 'Assortiment d’exception : 4 Nigiri Saumon/Thon, 4 Sashimi et 4 Dragon Rolls flambés.',
    pieces: '12 pièces',
    image: '/images/hero_sushi_plate.webp',
    rating: 5.0,
    popular: true,
    spicy: false,
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Sashimi Premium Thon & Saumon',
    category: 'sashimi',
    price: 6000,
    price_formatted: '6 000 FCFA',
    description: 'Tranches épaisses de saumon d’Écosse et thon rouge de ligne, gingembre mariné artisanal.',
    pieces: '8 pièces',
    image: '/images/sushi_diagonal.webp',
    rating: 4.9,
    popular: true,
    spicy: false,
    display_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Dragon Roll Ember Flambé',
    category: 'rolls',
    price: 7500,
    price_formatted: '7 500 FCFA',
    description: 'Crevette tempura croustillante, surmonté d’avocat fondant et saumon flambé à la sauce unagi.',
    pieces: '8 pièces',
    image: '/images/black_plate_leaf.webp',
    rating: 4.9,
    popular: false,
    spicy: true,
    display_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Bol Chirashi Gourmand',
    category: 'chirashi',
    price: 8000,
    price_formatted: '8 000 FCFA',
    description: 'Riz vinaigré assaisonné couvert de dés de poissons crus, ikura, edamame et radis pickled.',
    pieces: '1 grand bol',
    image: '/images/sushi_bowl.webp',
    rating: 4.8,
    popular: false,
    spicy: false,
    display_order: 6,
    created_at: new Date().toISOString(),
  },
];

const initialReviews = [
  {
    id: '1',
    name: 'Jean-Marc K.',
    role: 'Gastronome Averti',
    avatar: 'JK',
    rating: 5,
    review_date: 'Il y a 2 jours',
    comment: 'Une fraîcheur absolue ! Le Saumon Nigiri Flambé est tout simplement le meilleur de la ville. Le cadre sombre et feutré ajoute une vraie touche de luxe.',
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Benali',
    role: 'Cliente Régulière',
    avatar: 'SB',
    rating: 5,
    review_date: 'Il y a 1 semaine',
    comment: 'Commande livrée en 35 minutes, emballage zéro défaut et la température était parfaite. Les Dragon Rolls sont une tuerie !',
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Alexandre V.',
    role: 'Critique Culinaire',
    avatar: 'AV',
    rating: 5,
    review_date: 'Il y a 2 semaines',
    comment: 'Ember Sushi surpasse les standards de la cuisine japonaise moderne. Le plateau Omakase est une œuvre d’art visuelle et gustative.',
    display_order: 3,
    created_at: new Date().toISOString(),
  },
];

const mockStore: Record<string, any[]> = {
  dishes: [...initialDishes],
  reviews: [...initialReviews],
  content_blocks: [],
  reservations: [],
  commandes: [],
  page_views: [],
};

const listeners = new Set<() => void>();
function notifyListeners() {
  listeners.forEach((l) => {
    try {
      l();
    } catch {}
  });
}

function createMockSupabaseClient() {
  return {
    from: (table: string) => {
      let filtered = [...(mockStore[table] || [])];

      const builder: any = {
        select: (_cols?: string, _opts?: any) => builder,
        order: (col: string, opts?: { ascending?: boolean }) => {
          filtered.sort((a, b) => {
            const valA = a[col];
            const valB = b[col];
            if (valA === valB) return 0;
            if (opts?.ascending === false) return valA < valB ? 1 : -1;
            return valA > valB ? 1 : -1;
          });
          return builder;
        },
        eq: (col: string, val: any) => {
          filtered = filtered.filter((row) => row[col] === val);
          return builder;
        },
        in: (col: string, vals: any[]) => {
          filtered = filtered.filter((row) => vals.includes(row[col]));
          return builder;
        },
        gte: (col: string, val: any) => {
          filtered = filtered.filter((row) => row[col] >= val);
          return builder;
        },
        lte: (col: string, val: any) => {
          filtered = filtered.filter((row) => row[col] <= val);
          return builder;
        },
        insert: (rows: any | any[]) => {
          const arr = Array.isArray(rows) ? rows : [rows];
          if (!mockStore[table]) mockStore[table] = [];
          const inserted = arr.map((r) => ({
            id: r.id || String(Date.now() + Math.random()),
            created_at: new Date().toISOString(),
            ...r,
          }));
          mockStore[table].push(...inserted);
          notifyListeners();
          const insertBuilder: any = {
            select: () => insertBuilder,
            then: (resolve: any) => Promise.resolve({ data: inserted, error: null, count: inserted.length }).then(resolve),
          };
          return insertBuilder;
        },
        update: (updates: any) => {
          let updatedRows: any[] = [];
          const updateBuilder: any = {
            eq: (col: string, val: any) => {
              if (mockStore[table]) {
                mockStore[table] = mockStore[table].map((row) => {
                  if (row[col] === val) {
                    const merged = { ...row, ...updates };
                    updatedRows.push(merged);
                    return merged;
                  }
                  return row;
                });
                notifyListeners();
              }
              return updateBuilder;
            },
            then: (resolve: any) => Promise.resolve({ data: updatedRows, error: null }).then(resolve),
          };
          return updateBuilder;
        },
        delete: () => {
          let deletedRows: any[] = [];
          const deleteBuilder: any = {
            eq: (col: string, val: any) => {
              if (mockStore[table]) {
                deletedRows = mockStore[table].filter((row) => row[col] === val);
                mockStore[table] = mockStore[table].filter((row) => row[col] !== val);
                notifyListeners();
              }
              return deleteBuilder;
            },
            then: (resolve: any) => Promise.resolve({ data: deletedRows, error: null }).then(resolve),
          };
          return deleteBuilder;
        },
        then: (resolve: any) => {
          return Promise.resolve({
            data: filtered,
            error: null,
            count: filtered.length,
          }).then(resolve);
        },
      };
      return builder;
    },
    channel: (_channelName: string) => {
      const callbacks: (() => void)[] = [];
      const chan: any = {
        on: (_event: string, _filter: any, callback: () => void) => {
          callbacks.push(callback);
          listeners.add(callback);
          return chan;
        },
        subscribe: () => {
          return chan;
        },
      };
      return chan;
    },
    removeChannel: (_chan: any) => {},
    storage: {
      from: (_bucket: string) => ({
        upload: async (path: string, _file: any) => ({ data: { path }, error: null }),
        getPublicUrl: (path: string) => ({
          data: { publicUrl: path.startsWith('http') || path.startsWith('/') ? path : `/images/hero_sushi_plate.webp` },
        }),
      }),
    },
  };
}

let client: any;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('[Supabase] Initialisation standard impossible, bascule vers le client in-memory:', e);
    client = createMockSupabaseClient();
  }
} else {
  client = createMockSupabaseClient();
}

export const supabase = client;
