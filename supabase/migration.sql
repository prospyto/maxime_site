-- À exécuter une seule fois dans Supabase > SQL Editor

create table if not exists reservations (
  id bigint generated always as identity primary key,
  date text,
  heure text,
  couverts text,
  nom text,
  telephone text,
  demande text,
  soumis_le text,
  created_at timestamptz default now()
);

create table if not exists commandes (
  id bigint generated always as identity primary key,
  numero text,
  type text,
  adresse text,
  articles text,
  total text,
  soumis_le text,
  created_at timestamptz default now()
);

-- RLS : même niveau de sécurité que l'ancienne intégration Google Sheets
-- (aucune auth requise pour écrire depuis le site public ; la lecture admin
-- reste protégée en amont par le cookie de session dans /api/admin-data)
alter table reservations enable row level security;
alter table commandes enable row level security;

create policy "Autoriser insertion publique reservations" on reservations
  for insert to anon with check (true);
create policy "Autoriser lecture reservations" on reservations
  for select to anon using (true);

create policy "Autoriser insertion publique commandes" on commandes
  for insert to anon with check (true);
create policy "Autoriser lecture commandes" on commandes
  for select to anon using (true);

-- Active la réplication temps réel pour l'admin
alter publication supabase_realtime add table reservations;
alter publication supabase_realtime add table commandes;
