-- 후기 게시판 조회수
-- Supabase SQL Editor에서 1회 실행하세요.

create table if not exists public.review_view_counts (
  review_id uuid primary key references public.reviews(id) on delete cascade,
  view_count bigint not null default 0
);

alter table public.review_view_counts enable row level security;

drop policy if exists "Public can view review counts" on public.review_view_counts;
create policy "Public can view review counts"
on public.review_view_counts
for select
to anon, authenticated
using (true);

create or replace function public.increment_review_view(target_review_id uuid)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  next_count bigint;
begin
  insert into public.review_view_counts(review_id, view_count)
  values(target_review_id, 1)
  on conflict(review_id)
  do update set view_count = public.review_view_counts.view_count + 1
  returning view_count into next_count;

  return next_count;
end;
$$;

grant execute on function public.increment_review_view(uuid) to anon, authenticated;
