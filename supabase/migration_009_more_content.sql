-- À exécuter dans Supabase > SQL Editor

-- 1) Table reviews (avis clients), même logique que dishes : CRUD complet depuis l'admin
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  avatar text not null default '',
  rating integer not null default 5,
  review_date text not null default '',
  comment text not null default '',
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table reviews enable row level security;

create policy "Autoriser lecture publique reviews" on reviews
  for select to anon using (true);
create policy "Autoriser écriture reviews" on reviews
  for all to anon using (true) with check (true);

alter publication supabase_realtime add table reviews;

-- Seed : reprend les 3 avis actuellement codés en dur dans TabbedShowcase.tsx
insert into reviews (name, role, avatar, rating, review_date, comment, display_order) values
  ('Jean-Marc K.', 'Gastronome Averti', 'JK', 5, 'Il y a 2 jours', 'Une fraîcheur absolue ! Le Saumon Nigiri Flambé est tout simplement le meilleur de la ville. Le cadre sombre et feutré ajoute une vraie touche de luxe.', 1),
  ('Sarah Benali', 'Cliente Régulière', 'SB', 5, 'Il y a 1 semaine', 'Commande livrée en 35 minutes, emballage zéro défaut et la température était parfaite. Les Dragon Rolls sont une tuerie !', 2),
  ('Alexandre V.', 'Critique Culinaire', 'AV', 5, 'Il y a 2 semaines', 'Ember Sushi surpasse les standards de la cuisine japonaise moderne. Le plateau Omakase est une œuvre d''art visuelle et gustative.', 3);

-- 2) Nouvelles clés content_blocks : en-têtes Nos Plats / Menu Populaire / Avis Clients,
--    Contact, réseaux sociaux, formulaires
insert into content_blocks (key, value, type, section) values
  -- En-têtes de TabbedShowcase.tsx
  ('showcase_plats_title', 'Toutes nos Créations Gourmandes', 'text', 'showcase'),
  ('showcase_plats_subtitle', 'Sélectionnez et ajoutez directement à votre panier de dégustation.', 'text', 'showcase'),
  ('showcase_populaire_badge', 'Incontournables', 'text', 'showcase'),
  ('showcase_populaire_title', 'Les Incontournables d''Ember Sushi', 'text', 'showcase'),
  ('showcase_populaire_subtitle', 'Plats les plus commandés et plébiscités par nos clients réguliers.', 'text', 'showcase'),
  ('showcase_avis_badge', 'Expériences Reçues', 'text', 'showcase'),
  ('showcase_avis_title', 'Ce que disent nos Gourmets', 'text', 'showcase'),
  ('showcase_avis_subtitle', 'Note moyenne de 4.9/5 sur plus de 1,200 avis vérifiés.', 'text', 'showcase'),

  -- Section Contact (ContactMenuSection.tsx)
  ('contact_badge', 'Information & Dégustation', 'text', 'contact'),
  ('contact_title', 'Contactez-nous', 'text', 'contact'),
  ('contact_subtitle', 'Une question, une réservation de groupe, un événement privé ? Notre équipe dévouée vous répond immédiatement.', 'text', 'contact'),
  ('contact_image', '/images/black_plate_leaf.webp', 'image', 'contact'),
  ('contact_feature1_label', 'Adresse', 'text', 'contact'),
  ('contact_feature1_text', '142 Avenue des Champs-Élysées, 75008 Paris & Plateau, Abidjan', 'text', 'contact'),
  ('contact_feature2_label', 'Livraison', 'text', 'contact'),
  ('contact_feature2_text', 'Disponible en moins de 45 min', 'text', 'contact'),
  ('contact_feature3_label', 'Réservation en ligne', 'text', 'contact'),
  ('contact_feature3_text', 'Confirmation instantanée', 'text', 'contact'),
  ('contact_feature4_label', 'Événements privés', 'text', 'contact'),
  ('contact_feature4_text', 'Traiteur & Chef à domicile', 'text', 'contact'),
  ('contact_feature5_label', 'Click & Collect', 'text', 'contact'),
  ('contact_feature5_text', 'Prêt en 15 minutes', 'text', 'contact'),

  -- Réseaux sociaux (Footer.tsx)
  ('social_instagram_url', 'https://www.facebook.com/prospere.azonglahoun', 'text', 'social'),
  ('social_facebook_url', 'https://www.facebook.com/prospere.azonglahoun', 'text', 'social'),
  ('social_twitter_url', 'https://www.facebook.com/prospere.azonglahoun', 'text', 'social'),

  -- Formulaires (ReservationModal.tsx, OrderCartDrawer.tsx)
  ('form_reservation_title', 'Réserver une Table', 'text', 'forms'),
  ('form_reservation_subtitle', 'Ember Sushi • Confirmation immédiate', 'text', 'forms'),
  ('form_commande_title', 'Votre Panier', 'text', 'forms')
on conflict (key) do nothing;
