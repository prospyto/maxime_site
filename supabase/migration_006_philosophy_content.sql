-- À exécuter dans Supabase > SQL Editor

insert into content_blocks (key, value, type, section) values
  ('philo_badge', 'Engagement & Excellence', 'text', 'philosophie'),
  ('philo_title', 'Notre Philosophie Culinaire', 'text', 'philosophie'),
  ('philo_subtitle', 'Fraîcheur, précision, passion — trois piliers indissociables qui définissent chacune de nos assiettes.', 'text', 'philosophie'),
  ('philo_card1_title', 'Produits Frais', 'text', 'philosophie'),
  ('philo_card1_text', 'Nos poissons sont sélectionnés chaque matin auprès de fournisseurs locaux et internationaux rigoureusement choisis pour leur fraîcheur irréprochable.', 'text', 'philosophie'),
  ('philo_card2_title', 'Savoir-Faire', 'text', 'philosophie'),
  ('philo_card2_text', 'Nos chefs maîtrisent les techniques traditionnelles japonaises à la perfection, alliées à une touche contemporaine unique propre à Ember Sushi.', 'text', 'philosophie'),
  ('philo_image1', '/images/sashimi_macro.webp', 'image', 'philosophie'),
  ('philo_image2', '/images/sushi_rolls_macro.webp', 'image', 'philosophie')
on conflict (key) do nothing;
