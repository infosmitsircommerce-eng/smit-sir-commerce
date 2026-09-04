-- Commerce Resource Engine
-- Public PDFs are readable; only authenticated platform admins can manage files.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'commerce-materials',
  'commerce-materials',
  true,
  26214400,
  array['application/pdf']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read commerce materials" on storage.objects;
create policy "public read commerce materials"
on storage.objects for select
to public
using (bucket_id = 'commerce-materials');

drop policy if exists "admins upload commerce materials" on storage.objects;
create policy "admins upload commerce materials"
on storage.objects for insert
to authenticated
with check (bucket_id = 'commerce-materials' and (select private.is_platform_admin()));

drop policy if exists "admins update commerce materials" on storage.objects;
create policy "admins update commerce materials"
on storage.objects for update
to authenticated
using (bucket_id = 'commerce-materials' and (select private.is_platform_admin()))
with check (bucket_id = 'commerce-materials' and (select private.is_platform_admin()));

drop policy if exists "admins delete commerce materials" on storage.objects;
create policy "admins delete commerce materials"
on storage.objects for delete
to authenticated
using (bucket_id = 'commerce-materials' and (select private.is_platform_admin()));
