-- À exécuter dans Supabase > SQL Editor

insert into content_blocks (key, value, type, section) values
  ('spec_card1_cta', 'Explorer', 'text', 'specialites'),
  ('spec_card2_cta', 'Découvrir', 'text', 'specialites'),
  ('spec_card3_cta', 'Découvrir', 'text', 'specialites')
on conflict (key) do nothing;
