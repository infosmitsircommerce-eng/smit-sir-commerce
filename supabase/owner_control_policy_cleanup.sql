-- Smit Sir Commerce — owner control policy cleanup
-- Keeps one efficient UPDATE policy while a private trigger prevents students
-- from changing Pro access on their own accounts.

create index if not exists premium_access_log_actor_changed_idx on public.premium_access_log(actor_user_id, changed_at desc);

drop policy if exists "admins update premium access" on public.profiles;
drop policy if exists "students update own preferences" on public.profiles;
create policy "profile update own or admin"
on public.profiles
for update to authenticated
using ((select auth.uid()) = id or (select private.is_platform_admin()))
with check ((select auth.uid()) = id or (select private.is_platform_admin()));

revoke update on public.profiles from anon, authenticated;
grant update (class_level, board, subjects, study_goal, exam_date, onboarding_completed, is_premium, premium_until) on public.profiles to authenticated;

create or replace function private.enforce_profile_update_rules()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
begin
  if not private.is_platform_admin() then
    if old.is_premium is distinct from new.is_premium
       or old.premium_until is distinct from new.premium_until then
      raise exception 'Only a platform admin can change Pro access';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function private.enforce_profile_update_rules() from public, anon, authenticated;

drop trigger if exists enforce_profile_update_rules on public.profiles;
create trigger enforce_profile_update_rules
before update on public.profiles
for each row execute function private.enforce_profile_update_rules();
