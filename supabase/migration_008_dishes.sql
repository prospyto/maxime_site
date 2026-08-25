-- À exécuter dans Supabase > SQL Editor

create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'signature', -- 'nigiri' | 'sashimi' | 'rolls' | 'chirashi' | 'signature'
  price integer not null default 0, -- en FCFA
  price_formatted text not null default '',
  description text not null default '',
  pieces text not null default '',
  image text not null default '',
  rating numeric(2,1) not null default 5.0,
  popular boolean not null default false,
  spicy boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (name)
);

alter table dishes enable row level security;

create policy "Autoriser lecture publique dishes" on dishes
  for select to anon using (true);
create policy "Autoriser écriture dishes" on dishes
  for all to anon using (true) with check (true);

alter publication supabase_realtime add table dishes;

-- Seed : reprend les 6 plats actuellement codés en dur dans TabbedShowcase.tsx (sampleDishes)
insert into dishes (name, category, price, price_formatted, description, pieces, image, rating, popular, spicy, display_order) values
  ('Saumon Nigiri Aburi', 'nigiri', 4500, '4 500 FCFA', 'Nigiri au saumon atlantique légèrement flambé au chalumeau, huile de sésame et perles de caviar.', '6 pièces', '/images/sashimi_macro.webp', 4.9, true, false, 1),
  ('California Roll Signature', 'rolls', 5000, '5 000 FCFA', 'Chair de crabe royal, avocat, concombre croquant et tobiko orange éclatant.', '8 pièces', '/images/sushi_rolls_macro.webp', 4.8, true, false, 2),
  ('Plateau Découverte Omakase', 'signature', 9500, '9 500 FCFA', 'Assortiment d''exception : 4 Nigiri Saumon/Thon, 4 Sashimi et 4 Dragon Rolls flambés.', '12 pièces', '/images/hero_sushi_plate.webp', 5.0, true, false, 3),
  ('Sashimi Premium Thon & Saumon', 'sashimi', 6000, '6 000 FCFA', 'Tranches épaisses de saumon d''Écosse et thon rouge de ligne, gingembre mariné artisanal.', '8 pièces', '/images/sushi_diagonal.webp', 4.9, true, false, 4),
  ('Dragon Roll Ember Flambé', 'rolls', 7500, '7 500 FCFA', 'Crevette tempura croustillante, surmonté d''avocat fondant et saumon flambé à la sauce unagi.', '8 pièces', '/images/black_plate_leaf.webp', 4.9, false, true, 5),
  ('Bol Chirashi Gourmand', 'chirashi', 8000, '8 000 FCFA', 'Riz vinegre assaisonné couvert de dés de poissons crus, ikura, edamame et radis pickled.', '1 grand bol', '/images/sushi_bowl.webp', 4.8, false, false, 6)
on conflict (name) do nothing;
