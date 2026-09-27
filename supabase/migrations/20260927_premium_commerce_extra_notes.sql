create table if not exists public.premium_commerce_extras_notes (
  resource_key text primary key,
  subject text not null check (subject in ('Microeconomics', 'Business Studies', 'Accountancy')),
  chapter integer not null check (chapter between 1 and 30),
  title text not null,
  pages smallint not null default 50 check (pages = 50),
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
  updated_at timestamptz not null default now()
);
create table if not exists public.premium_commerce_extras_chunks (
  resource_key text not null references public.premium_commerce_extras_notes(resource_key) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  payload text not null,
  primary key (resource_key, chunk_index)
);
alter table public.premium_commerce_extras_notes enable row level security;
alter table public.premium_commerce_extras_chunks enable row level security;
revoke all on public.premium_commerce_extras_notes from public, anon, authenticated;
revoke all on public.premium_commerce_extras_chunks from public, anon, authenticated;
grant all on public.premium_commerce_extras_notes to service_role;
grant all on public.premium_commerce_extras_chunks to service_role;
comment on table public.premium_commerce_extras_notes is 'Premium-only extra chapter notes and question practice. Files served only through entitlement-checked API.';
comment on table public.premium_commerce_extras_chunks is 'Service-role-only base64 chunks for premium commerce extra PDF delivery.';
