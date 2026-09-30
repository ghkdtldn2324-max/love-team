create table if not exists public.notice_view_counts (
  notice_id bigint primary key,
  views bigint not null default 0 check (views >= 0)
);

alter table public.notice_view_counts enable row level security;

drop policy if exists "Public can view notice view counts"
on public.notice_view_counts;

create policy "Public can view notice view counts"
on public.notice_view_counts
for select to anon, authenticated using (true);

insert into public.notice_view_counts (notice_id, views)
select id, 0 from public.notices
on conflict (notice_id) do nothing;

drop function if exists public.increment_notice_view(integer);

create or replace function public.increment_notice_view(p_notice_id bigint)
returns bigint language plpgsql security definer set search_path = public
as $$
declare next_views bigint;
begin
  if not exists (select 1 from public.notices where id=p_notice_id) then
    raise exception 'INVALID_NOTICE_ID';
  end if;
  insert into public.notice_view_counts(notice_id,views) values(p_notice_id,1)
  on conflict(notice_id) do update set views=public.notice_view_counts.views+1
  returning views into next_views;
  return next_views;
end;
$$;

revoke all on function public.increment_notice_view(bigint) from public;
grant execute on function public.increment_notice_view(bigint) to anon, authenticated;
