-- À exécuter dans Supabase > SQL Editor
-- Ajoute les colonnes nom et téléphone à la table commandes existante
-- (nécessaire pour pouvoir livrer les clients)

alter table commandes add column if not exists nom text;
alter table commandes add column if not exists telephone text;
