-- À exécuter dans Supabase > SQL Editor

insert into content_blocks (key, value, type, section) values
  ('order_badge', 'Service Sur-Mesure', 'text', 'order'),
  ('order_title_line1', 'Commandez Votre', 'text', 'order'),
  ('order_title_highlight', 'Expérience Sushi', 'text', 'order'),
  ('order_subtitle', 'Que ce soit pour une commande à emporter, une livraison express ou une réservation en salle, vivez l''expérience Ember Sushi avec la même exigence et fraîcheur exceptionnelle.', 'text', 'order'),
  ('order_image', '/images/sushi_diagonal.webp', 'image', 'order')
on conflict (key) do nothing;
