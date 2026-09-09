create table public.premium_payment_claims (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  transaction_reference text not null unique check (char_length(transaction_reference) between 6 and 80),
  amount_inr integer not null default 999 check (amount_inr = 999),
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id)
);

alter table public.premium_payment_claims enable row level security;
revoke all on public.premium_payment_claims from anon, authenticated;
grant select on public.premium_payment_claims to authenticated;

create policy "students read own payment claims"
on public.premium_payment_claims for select to authenticated
using (student_id = (select auth.uid()) or (select private.is_platform_admin()));

create function public.submit_premium_payment_claim(p_reference text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare claim_id uuid; clean_reference text;
begin
  if auth.uid() is null then raise exception 'Sign in required' using errcode = '42501'; end if;
  clean_reference := upper(btrim(p_reference));
  if clean_reference is null or clean_reference !~ '^[A-Z0-9/-]{6,80}$' then
    raise exception 'Enter a valid transaction reference (6–80 letters or numbers)';
  end if;
  if exists (select 1 from public.premium_payment_register where transaction_reference = clean_reference) then
    raise exception 'This transaction reference has already been verified' using errcode = '23505';
  end if;
  insert into public.premium_payment_claims(student_id, transaction_reference)
  values(auth.uid(), clean_reference) returning id into claim_id;
  return claim_id;
end;
$$;

create function public.review_premium_payment_claim(p_claim_id uuid, p_approve boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare claim public.premium_payment_claims%rowtype;
begin
  if not coalesce(private.is_platform_admin(), false) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  select * into claim from public.premium_payment_claims where id = p_claim_id for update;
  if claim.id is null then raise exception 'Payment claim not found'; end if;
  if claim.status <> 'pending' then raise exception 'This claim has already been reviewed'; end if;
  if p_approve then
    if exists (select 1 from public.premium_payment_register where transaction_reference = claim.transaction_reference) then
      raise exception 'This transaction reference has already been verified' using errcode = '23505';
    end if;
    insert into public.premium_payment_register(student_id, transaction_reference, amount_inr, verified_by)
    values(claim.student_id, claim.transaction_reference, 999, auth.uid());
    update public.profiles set is_premium = true, premium_until = null where id = claim.student_id;
  end if;
  update public.premium_payment_claims
  set status = case when p_approve then 'verified' else 'rejected' end,
      reviewed_at = now(), reviewed_by = auth.uid()
  where id = claim.id;
end;
$$;

revoke all on function public.submit_premium_payment_claim(text) from public, anon;
grant execute on function public.submit_premium_payment_claim(text) to authenticated;
revoke all on function public.review_premium_payment_claim(uuid, boolean) from public, anon;
grant execute on function public.review_premium_payment_claim(uuid, boolean) to authenticated;
