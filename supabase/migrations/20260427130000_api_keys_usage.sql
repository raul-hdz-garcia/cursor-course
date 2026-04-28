-- Per-key usage counter and limit for github-summarizer (and similar) APIs.
alter table public.api_keys
  add column if not exists usage integer not null default 0 check (usage >= 0);

alter table public.api_keys
  add column if not exists usage_limit integer not null default 100 check (usage_limit >= 0);

comment on column public.api_keys.usage is 'Increments when an API route consumes quota for this key.';
comment on column public.api_keys.usage_limit is '429 when usage exceeds this value after increment (usage > usage_limit).';

-- Atomically increment usage and return new values (JS client cannot express usage + 1 safely).
create or replace function public.increment_api_key_usage(p_key text)
returns table (usage integer, usage_limit integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Avoid silent 0-row UPDATE when RLS would block (see 20260427140000 migration).
  perform set_config('row_security', 'off', true);
  return query
  update public.api_keys k
  set usage = k.usage + 1, updated_at = now()
  where k.key = p_key
  returning k.usage, k.usage_limit;
end;
$$;

revoke all on function public.increment_api_key_usage(text) from public;
grant execute on function public.increment_api_key_usage(text) to anon, authenticated, service_role;
