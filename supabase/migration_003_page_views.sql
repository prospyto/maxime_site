-- À exécuter dans Supabase > SQL Editor

create table if not exists page_views (
  id bigint generated always as identity primary key,
  path text,
  session_id text,
  created_at timestamptz default now()
);

alter table page_views enable row level security;

create policy "Autoriser insertion publique page_views" on page_views
  for insert to anon with check (true);
create policy "Autoriser lecture page_views" on page_views
  for select to anon using (true);

alter publication supabase_realtime add table page_views;

-- Index pour accélérer les requêtes par date (courbes, stats du jour)
create index if not exists page_views_created_at_idx on page_views (created_at);
