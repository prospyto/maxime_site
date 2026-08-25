-- À exécuter dans Supabase > SQL Editor
-- Autorise l'upload et la lecture publique dans le bucket 'site-content'

create policy "Autoriser upload public site-content"
on storage.objects for insert
to anon
with check (bucket_id = 'site-content');

create policy "Autoriser mise à jour site-content"
on storage.objects for update
to anon
using (bucket_id = 'site-content');

create policy "Autoriser lecture publique site-content"
on storage.objects for select
to anon
using (bucket_id = 'site-content');
