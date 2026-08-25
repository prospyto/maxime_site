-- À exécuter dans Supabase > SQL Editor

create table if not exists content_blocks (
  key text primary key,
  value text,
  type text default 'text', -- 'text' ou 'image'
  section text default 'general',
  updated_at timestamptz default now()
);

alter table content_blocks enable row level security;

create policy "Autoriser lecture publique content_blocks" on content_blocks
  for select to anon using (true);
create policy "Autoriser écriture content_blocks" on content_blocks
  for all to anon using (true) with check (true);

alter publication supabase_realtime add table content_blocks;

-- Contenu par défaut de la section Hero (reprend le texte actuel du site)
insert into content_blocks (key, value, type, section) values
  ('hero_title_line1', 'Une Expérience Sushi', 'text', 'hero'),
  ('hero_title_highlight', 'Moderne & Authentique', 'text', 'hero'),
  ('hero_subtitle', 'Chez Ember Sushi, chaque pièce est façonnée à la main avec des produits frais d''exception. Une gastronomie japonaise raffinée et créative.', 'text', 'hero'),
  ('hero_image', '/images/hero_sushi_plate.webp', 'image', 'hero')
on conflict (key) do nothing;
