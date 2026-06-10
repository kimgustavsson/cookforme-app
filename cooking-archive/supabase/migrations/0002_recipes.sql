-- 레시피는 개인이 아니라 "그룹"에 귀속됩니다.

create table if not exists public.recipes (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.groups(id) on delete cascade,
  created_by  uuid references auth.users(id) on delete set null, -- 누가 올렸나 (기록용)
  source_kind text not null check (source_kind in ('web','youtube','image','manual')),
  source_url  text,
  title       text not null,
  image_url   text,
  servings    int,
  ingredients jsonb not null default '[]',
  steps       jsonb not null default '[]',
  status      text not null default 'draft' check (status in ('draft','saved')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.recipes enable row level security;

-- ★ 프론트는 그냥 select('*') 해도, 내 그룹 레시피만 알아서 걸러져 옵니다.
create policy "read group recipes" on public.recipes
  for select using (group_id in (select public.my_group_ids()));

-- 내가 속한 그룹에만 추가 가능 + 올린 사람 기록.
create policy "insert into my group" on public.recipes
  for insert with check (
    group_id in (select public.my_group_ids()) and created_by = auth.uid()
  );

-- 그룹 공유 자산이므로 멤버면 수정/삭제 가능.
create policy "update group recipes" on public.recipes
  for update using (group_id in (select public.my_group_ids()));
create policy "delete group recipes" on public.recipes
  for delete using (group_id in (select public.my_group_ids()));
