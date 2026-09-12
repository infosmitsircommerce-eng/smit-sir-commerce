begin;
do $test$
declare admin_id uuid; student uuid; payment uuid; base jsonb; after_metrics jsonb; total integer;
begin
  select id into admin_id from public.profiles where is_admin = true or role = 'admin' limit 1;
  select id into student from public.profiles where not coalesce(is_admin,false) and coalesce(role,'student') <> 'admin' limit 1;
  if admin_id is null or student is null then raise exception 'Existing test actors unavailable'; end if;
  perform set_config('request.jwt.claims', jsonb_build_object('sub',admin_id,'role','authenticated')::text, true);
  set local role authenticated;
  base := public.get_premium_conversion_metrics(now() - interval '30 days');
  -- Use the existing owner verification path, never a browser analytics event.
  payment := public.record_verified_quiz_payment(student, 'SSC-TRACKING-TEST-' || upper(gen_random_uuid()::text));
  after_metrics := public.get_premium_conversion_metrics(now() - interval '30 days');
  if (after_metrics->>'verified_activations')::int <> (base->>'verified_activations')::int + 1
    or (after_metrics->>'verified_revenue_inr')::int <> (base->>'verified_revenue_inr')::int + 999
    then raise exception 'Verified totals mismatch'; end if;
  reset role;
  select count(*) into total from public.learning_events where event_name='premium_activation_verified' and metadata->>'payment_id'=payment::text;
  if total <> 1 then raise exception 'Activation must be recorded exactly once'; end if;
  if exists(select 1 from public.learning_events where metadata->>'payment_id'=payment::text and (metadata ? 'reference' or metadata ? 'transaction_reference')) then raise exception 'Reference leaked'; end if;
  perform set_config('request.jwt.claims', '{}', true);
  set local role anon;
  insert into public.learning_events(event_name,path,metadata) values('premium_qr_open','/premium','{}');
  begin
    insert into public.learning_events(event_name,path,metadata) values('premium_activation_verified','/premium','{}');
    raise exception 'Anonymous forged activation accepted';
  exception when insufficient_privilege then null; end;
  begin
    perform public.get_premium_conversion_metrics(now() - interval '30 days');
    raise exception 'Anonymous read accepted';
  exception when insufficient_privilege then null; end;
  reset role;
  perform set_config('request.jwt.claims', jsonb_build_object('sub',student,'role','authenticated')::text, true);
  set local role authenticated;
  begin
    perform public.get_premium_conversion_metrics(now() - interval '30 days');
    raise exception 'Student read accepted';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.learning_events(event_name,path,metadata) values('premium_activation_verified','/premium','{}');
    raise exception 'Student forged activation accepted';
  exception when insufficient_privilege then null; end;
  reset role;
end;
$test$;
rollback;
select 'Passed: verified RPC records one activation; accurate revenue; no references; guest/student forgery and reads denied; all test writes rolled back' as checks;
