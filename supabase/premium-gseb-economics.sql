-- Schema applied through Supabase MCP. PDF payloads stay outside the public repository.
create table public.premium_gseb_economics_notes (
  chapter integer primary key check (chapter between 2 and 11),
  title text not null,
  pages integer not null check (pages > 0),
  file_base64 text not null,
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);
alter table public.premium_gseb_economics_notes enable row level security;
revoke all on public.premium_gseb_economics_notes from public, anon, authenticated;
grant select on public.premium_gseb_economics_notes to authenticated;
create policy "Active Premium accounts can read GSEB Economics PDFs"
on public.premium_gseb_economics_notes for select to authenticated
using ((select exists (
  select 1 from public.profiles p
  where p.id = (select auth.uid())
    and (p.is_admin is true or p.role = 'admin'
      or (p.is_premium is true and (p.premium_until is null or p.premium_until > now())))
)));
