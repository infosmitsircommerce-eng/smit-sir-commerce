-- Student onboarding preferences for Smit Sir Commerce
-- This migration is already applied to the connected production Supabase project.

alter table public.profiles add column if not exists board text;
alter table public.profiles add column if not exists subjects text[] not null default '{}'::text[];
alter table public.profiles add column if not exists study_goal text;
alter table public.profiles add column if not exists exam_date date;
alter table public.profiles add column if not exists onboarding_completed boolean not null default false;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_board_check') then
    alter table public.profiles add constraint profiles_board_check check (board in ('CBSE','GSEB','Other') or board is null);
  end if;
end $$;

create or replace function public.update_student_preferences(
  p_class_level integer,
  p_board text,
  p_subjects text[],
  p_study_goal text,
  p_exam_date date default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed_subjects constant text[] := array['Accountancy','Economics','Business Studies','Entrepreneurship','Physical Education'];
  subject_name text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_class_level not in (11,12) then raise exception 'Class must be 11 or 12'; end if;
  if p_board not in ('CBSE','GSEB','Other') then raise exception 'Unsupported board'; end if;
  if p_subjects is null or cardinality(p_subjects) < 1 then raise exception 'Choose at least one subject'; end if;
  foreach subject_name in array p_subjects loop
    if not (subject_name = any(allowed_subjects)) then raise exception 'Unsupported subject'; end if;
  end loop;

  update public.profiles
  set class_level = p_class_level,
      board = p_board,
      subjects = p_subjects,
      study_goal = nullif(trim(p_study_goal), ''),
      exam_date = p_exam_date,
      onboarding_completed = true,
      updated_at = now()
  where id = auth.uid();
end;
$$;

revoke all on function public.update_student_preferences(integer,text,text[],text,date) from public, anon;
grant execute on function public.update_student_preferences(integer,text,text[],text,date) to authenticated;
