create table if not exists public.student_learning_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.student_learning_state enable row level security;

create policy "Students can read own learning state"
on public.student_learning_state for select
to authenticated
using (auth.uid() = user_id);

create policy "Students can insert own learning state"
on public.student_learning_state for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Students can update own learning state"
on public.student_learning_state for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists student_learning_state_updated_idx
on public.student_learning_state(updated_at desc);
