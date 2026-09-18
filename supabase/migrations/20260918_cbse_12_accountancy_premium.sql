create table if not exists public.premium_cbse_12_accountancy_notes (
  resource_key text primary key,
  part integer not null check (part in (1,2)),
  chapter integer not null check (chapter > 0),
  title text not null,
  pages integer not null check (pages > 0),
  sha256 text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.premium_cbse_12_accountancy_notes is
  'Protected CBSE Class 12 Accountancy Parts I and II Premium chapter PDFs. Served only through entitlement-checked server APIs.';

alter table public.premium_cbse_12_accountancy_notes enable row level security;
revoke all on table public.premium_cbse_12_accountancy_notes from anon, authenticated;

create table if not exists public.premium_cbse_12_accountancy_chunks (
  resource_key text not null,
  chunk_index integer not null check (chunk_index >= 0),
  payload text not null,
  primary key (resource_key, chunk_index)
);

comment on table public.premium_cbse_12_accountancy_chunks is
  'Service-role-only compressed base64 chunks for CBSE Class 12 Accountancy Premium PDF delivery.';

alter table public.premium_cbse_12_accountancy_chunks enable row level security;
revoke all on table public.premium_cbse_12_accountancy_chunks from anon, authenticated;

create index if not exists premium_cbse_12_accountancy_chunks_resource_idx
  on public.premium_cbse_12_accountancy_chunks(resource_key);
