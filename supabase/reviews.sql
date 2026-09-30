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
