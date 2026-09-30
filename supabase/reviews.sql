create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  stars integer not null check (stars between 1 and 5),
  content text not null check (char_length(content) between 5 and 300),
  service text not null check (service in ('승당','듀오','티어','배치고사','1:1')),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "Public can view reviews" on public.reviews;
create policy "Public can view reviews"
on public.reviews for select
to anon, authenticated
using (true);

drop policy if exists "Users can create own reviews" on public.reviews;
create policy "Users can create own reviews"
on public.reviews for insert
to authenticated
with check (auth.uid() = user_id);

create index if not exists reviews_created_at_idx
on public.reviews (created_at desc);


-- 후기 1시간 작성 제한
create table if not exists public.review_write_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  blocked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.review_write_limits enable row level security;

drop policy if exists "Users can view own review write limit" on public.review_write_limits;
create policy "Users can view own review write limit"
on public.review_write_limits
for select to authenticated
using (auth.uid() = user_id);

create or replace function public.enforce_review_write_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_blocked_until timestamptz;
begin
  select blocked_until into current_blocked_until
  from public.review_write_limits
  where user_id = new.user_id
  for update;

  if current_blocked_until is not null and current_blocked_until > now() then
    raise exception 'REVIEW_COOLDOWN:%', to_char(current_blocked_until, 'YYYY-MM-DD"T"HH24:MI:SSOF');
  end if;

  insert into public.review_write_limits(user_id, blocked_until, updated_at)
  values (new.user_id, now() + interval '1 hour', now())
  on conflict (user_id) do update set
    blocked_until = now() + interval '1 hour',
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists review_write_limit_trigger on public.reviews;
create trigger review_write_limit_trigger
before insert on public.reviews
for each row execute function public.enforce_review_write_limit();
