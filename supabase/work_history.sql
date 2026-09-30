create table if not exists public.work_history (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  detail text not null,
  status text not null check (status in ('progress','done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.work_history enable row level security;

drop policy if exists "Public can view work history" on public.work_history;
create policy "Public can view work history"
on public.work_history
for select
to anon, authenticated
using (true);

insert into public.work_history (display_name, detail, status)
select v.display_name, v.detail, v.status
from (
  values
    ('Gh***', '승당 3판 진행 중', 'progress'),
    ('Ab***', '플레티넘 → 다이아몬드', 'done'),
    ('Lo***', '듀오 5판 진행 중', 'progress'),
    ('Ki***', '배치고사 4판 진행 중', 'progress'),
    ('Mi***', '승당 7판 완료', 'done'),
    ('Se***', '골드 → 플래티넘', 'done')
) as v(display_name, detail, status)
where not exists (select 1 from public.work_history);

create index if not exists work_history_created_at_idx
on public.work_history (created_at desc);