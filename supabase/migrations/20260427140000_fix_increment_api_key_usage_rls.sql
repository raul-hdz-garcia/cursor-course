-- RLS can block UPDATE inside SECURITY DEFINER without error (0 rows updated). Disable row
-- security for this trusted increment so PostgREST returns updated rows reliably.
create or replace function public.increment_api_key_usage(p_key text)
returns table (usage integer, usage_limit integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform set_config('row_security', 'off', true);
  return query
  update public.api_keys k
  set usage = k.usage + 1, updated_at = now()
  where k.key = p_key
  returning k.usage, k.usage_limit;
end;
$$;
