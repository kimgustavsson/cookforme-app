-- 그룹 + 멤버십. "관계"가 아니라 일반적인 "그룹" 단위 — 부부·가족·친구 모두 그냥 그룹.

create table if not exists public.groups (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 교차 테이블: 한 유저가 여러 그룹에 동시 소속 가능.
create table if not exists public.group_members (
  group_id  uuid not null references public.groups(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

-- ★★ 무한 재귀 방지의 핵심 ★★
-- group_members 정책 안에서 group_members를 다시 조회하면
-- "infinite recursion detected in policy" 에러가 납니다.
-- SECURITY DEFINER 함수는 RLS를 우회해 멤버십을 읽으므로 고리가 끊깁니다.
-- 이후 모든 정책은 이 함수 하나만 호출합니다.
create or replace function public.my_group_ids()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select group_id from public.group_members where user_id = auth.uid()
$$;

alter table public.groups enable row level security;
alter table public.group_members enable row level security;

create policy "read my groups" on public.groups
  for select using (id in (select public.my_group_ids()));

create policy "create group" on public.groups
  for insert with check (created_by = auth.uid());

-- 함수를 쓰므로 group_members를 조회해도 재귀 없음.
create policy "read members of my groups" on public.group_members
  for select using (group_id in (select public.my_group_ids()));

-- 본인 멤버십만 추가/삭제. (실제 "초대 코드로 참여"는 RPC로 확장 — 아래 설명)
create policy "join as self" on public.group_members
  for insert with check (user_id = auth.uid());
create policy "leave as self" on public.group_members
  for delete using (user_id = auth.uid());
