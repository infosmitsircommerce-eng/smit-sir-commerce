-- Canonicalize admission lead phone numbers so 10-digit Indian numbers become +91 numbers.
-- Applied to the connected production Supabase project.

create or replace function private.prepare_lead_submission()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
declare
  normalized text;
begin
  normalized := regexp_replace(coalesce(new.mobile,''), '\D', '', 'g');
  if char_length(normalized) < 10 or char_length(normalized) > 15 then
    raise exception 'Please enter a valid mobile number';
  end if;

  if char_length(normalized) = 10 then
    new.mobile := '+91' || normalized;
    new.mobile_normalized := '91' || normalized;
  else
    new.mobile := '+' || normalized;
    new.mobile_normalized := normalized;
  end if;

  new.full_name := trim(new.full_name);
  new.message := nullif(trim(coalesce(new.message,'')), '');
  new.first_path := nullif(left(trim(coalesce(new.first_path,'')),240), '');
  new.utm_source := nullif(left(trim(coalesce(new.utm_source,'')),120), '');
  new.utm_medium := nullif(left(trim(coalesce(new.utm_medium,'')),120), '');
  new.utm_campaign := nullif(left(trim(coalesce(new.utm_campaign,'')),160), '');

  if exists (
    select 1 from public.leads l
    where l.mobile_normalized = new.mobile_normalized
      and l.last_enquiry_at > now() - interval '90 seconds'
  ) then
    return null;
  end if;
  return new;
end;
$$;
revoke all on function private.prepare_lead_submission() from public, anon, authenticated;
