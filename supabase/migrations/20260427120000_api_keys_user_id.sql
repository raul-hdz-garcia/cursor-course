-- Scope API keys to a signed-in app user. Apply in Supabase SQL editor or via CLI.
alter table public.api_keys
  add column if not exists user_id text references public.users (id) on delete cascade;

create index if not exists api_keys_user_id_idx on public.api_keys (user_id);
