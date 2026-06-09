-- recipes 테이블 + RLS. 권한은 "관계"가 아니라 "행동/상태"로만 판단합니다.

create table if not exists public.recipes (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users (id) on delete cascade,
  source_kind text not null check (source_kind in ('web','youtube','image','manual')),
  source_url  text,
  title       text not null,
  image       text,
  servings    int,
  ingredients jsonb not null default '[]',
  steps       jsonb not null default '[]',
  status      text not null default 'draft' check (status in ('draft','saved')),
  visibility  text not null default 'private' check (visibility in ('private','shared')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.recipes enable row level security;

-- 읽기: 내 것이거나, shared로 공개된 것.
create policy "read own or shared"
  on public.recipes for select
  using (owner_id = auth.uid() or visibility = 'shared');

-- 쓰기/수정/삭제: 본인 것만.
create policy "insert own"
  on public.recipes for insert
  with check (owner_id = auth.uid());

create policy "update own"
  on public.recipes for update
  using (owner_id = auth.uid());

create policy "delete own"
  on public.recipes for delete
  using (owner_id = auth.uid());

-- owner_id 자동 채우기 + updated_at 갱신
create or replace function public.set_recipe_defaults()
returns trigger language plpgsql as $$
begin
  if new.owner_id is null then new.owner_id := auth.uid(); end if;
  new.updated_at := now();
  return new;
end; $$;

create trigger recipes_defaults
  before insert or update on public.recipes
  for each row execute function public.set_recipe_defaults();
