create table public.premium_payment_register (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.profiles(id),
 transaction_reference text not null unique check (char_length(transaction_reference) between 6 and 80),
 amount_inr integer not null default 999 check(amount_inr=999),
 verified_by uuid not null references public.profiles(id),
 verified_at timestamptz not null default now()
);
alter table public.premium_payment_register enable row level security;
revoke all on public.premium_payment_register from anon, authenticated;
grant select on public.premium_payment_register to authenticated;
create policy "admins read payment register" on public.premium_payment_register for select to authenticated using ((select private.is_platform_admin()));
create function public.record_verified_quiz_payment(p_student_id uuid, p_reference text)
returns uuid language plpgsql security definer set search_path='' as $$
declare payment_id uuid; clean_reference text;
begin
 if not coalesce(private.is_platform_admin(),false) then raise exception 'Administrator access required' using errcode='42501'; end if;
 clean_reference := upper(btrim(p_reference));
 if clean_reference is null or clean_reference !~ '^[A-Z0-9/-]{6,80}$' then raise exception 'Enter a valid transaction reference (6–80 characters)'; end if;
 if not exists(select 1 from public.profiles where id=p_student_id) then raise exception 'Student account not found'; end if;
 insert into public.premium_payment_register(student_id,transaction_reference,verified_by)
 values(p_student_id,clean_reference,auth.uid()) returning id into payment_id;
 update public.profiles set is_premium=true,premium_until=null where id=p_student_id;
 return payment_id;
end;
$$;
revoke all on function public.record_verified_quiz_payment(uuid,text) from public,anon;
grant execute on function public.record_verified_quiz_payment(uuid,text) to authenticated;
