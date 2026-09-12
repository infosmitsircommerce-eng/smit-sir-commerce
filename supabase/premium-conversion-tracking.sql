-- Client interactions are intentions. Only the verified payment register records revenue.
create policy "clients cannot forge verified activations"
on public.learning_events as restrictive for insert to anon, authenticated
with check (event_name <> 'premium_activation_verified');

create or replace function private.track_verified_premium_activation()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.learning_events (user_id, event_name, path, metadata, created_at)
  values (new.student_id, 'premium_activation_verified', '/premium',
    jsonb_build_object('offer', 'lifetime-999', 'amount_inr', new.amount_inr,
      'payment_id', new.id, 'verification_source', 'payment_register'), new.verified_at);
  return new;
end;
$$;
revoke all on function private.track_verified_premium_activation() from public, anon, authenticated;
create trigger track_verified_premium_activation after insert on public.premium_payment_register
for each row execute function private.track_verified_premium_activation();

create or replace function public.get_premium_conversion_metrics(p_since timestamptz)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare result jsonb;
begin
  if not coalesce(private.is_platform_admin(), false) then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if p_since is null then raise exception 'Start date required'; end if;
  select jsonb_build_object(
    'qr_opens', count(*) filter (where event_name = 'premium_qr_open'),
    'qr_downloads', count(*) filter (where event_name = 'premium_qr_download'),
    'pdf_download_clicks', count(*) filter (where event_name = 'pdf_download_click'),
    'reference_submissions', count(*) filter (where event_name = 'premium_reference_submitted')
  ) into result from public.learning_events
    where created_at >= p_since and created_at <= now()
    and event_name in ('premium_qr_open', 'premium_qr_download', 'pdf_download_click', 'premium_reference_submitted');
  return result || (select jsonb_build_object('verified_activations', count(*),
    'verified_revenue_inr', coalesce(sum(amount_inr), 0))
    from public.premium_payment_register where verified_at >= p_since and verified_at <= now());
end;
$$;
revoke all on function public.get_premium_conversion_metrics(timestamptz) from public, anon;
grant execute on function public.get_premium_conversion_metrics(timestamptz) to authenticated;
