-- LOVE TEAM 작업 내역 조회수
-- Supabase SQL Editor에서 1회 실행하세요.
-- 기존 public.work_history 테이블은 변경하지 않습니다.

create table if not exists public.work_view_counts (
  work_id uuid primary key references public.work_history(id) on delete cascade,
  views bigint not null default 0 check (views >= 0)
);

alter table public.work_view_counts enable row level security;

drop policy if exists "Public can view work view counts"
on public.work_view_counts;

create policy "Public can view work view counts"
on public.work_view_counts
for select to anon, authenticated using (true);

insert into public.work_view_counts (work_id, views)
select id, 0 from public.work_history
on conflict (work_id) do nothing;

drop function if exists public.increment_work_view(uuid);

create or replace function public.increment_work_view(p_work_id uuid)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  next_views bigint;
begin
  if not exists (select 1 from public.work_history where id = p_work_id) then
    raise exception 'INVALID_WORK_ID';
  end if;

  insert into public.work_view_counts(work_id, views)
  values(p_work_id, 1)
  on conflict(work_id)
  do update set views = public.work_view_counts.views + 1
  returning views into next_views;

  return next_views;
end;
$$;

revoke all on function public.increment_work_view(uuid) from public;
grant execute on function public.increment_work_view(uuid) to anon, authenticated;
