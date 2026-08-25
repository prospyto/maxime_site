-- À exécuter dans Supabase > SQL Editor

insert into content_blocks (key, value, type, section) values
  ('spec_badge', 'Menu d''Exception', 'text', 'specialites'),
  ('spec_title', 'Nos Spécialités', 'text', 'specialites'),
  ('spec_subtitle', 'Produits de haute fraîcheur, préparations faites minute.', 'text', 'specialites'),
  ('spec_card1_title', 'Sushi Signature', 'text', 'specialites'),
  ('spec_card1_text', 'Sélection exclusive de créations artisanales façonnées à la main avec du saumon frais.', 'text', 'specialites'),
  ('spec_card2_title', 'Sashimi Premium', 'text', 'specialites'),
  ('spec_card2_text', 'Tranches de poisson cru minutieusement découpées pour une fraîcheur et texture incomparable.', 'text', 'specialites'),
  ('spec_card3_title', 'Rolls Créatifs', 'text', 'specialites'),
  ('spec_card3_text', 'Associations audacieuses entre haute gastronomie japonaise et saveurs fusion contemporaines.', 'text', 'specialites'),
  ('spec_image', '/images/sushi_bowl.webp', 'image', 'specialites')
on conflict (key) do nothing;
