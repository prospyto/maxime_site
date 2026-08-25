-- À exécuter dans Supabase > SQL Editor

insert into content_blocks (key, value, type, section) values
  ('cta_hero_button', 'Découvrir', 'text', 'cta'),
  ('cta_reserver_table', 'Réserver une table', 'text', 'cta'),
  ('cta_navbar_panier', 'Mon Panier', 'text', 'cta'),
  ('cta_order_commander', 'Commander maintenant', 'text', 'cta'),
  ('cta_contact_voir_menu', 'Voir le menu complet', 'text', 'cta'),
  ('cta_dish_ajouter_panier', 'Ajouter au panier', 'text', 'cta'),
  ('cta_dish_commander', 'Commander', 'text', 'cta')
on conflict (key) do nothing;
