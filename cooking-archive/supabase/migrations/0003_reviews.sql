-- 개인별 미식 평가. 한 레시피에 멤버마다 한 행 (남편 행 + 아내 행).

create table if not exists public.recipe_reviews (
  id         uuid primary key default gen_random_uuid(),
  recipe_id  uuid not null references public.recipes(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  rating     int check (rating between 1 and 5),
  comment    text,                              -- "이건 짜다", "감자 더 크게"
  cooked_at  date,                              -- 해 먹은 날 → 식생활 일기 타임라인
  created_at timestamptz not null default now(),
  unique (recipe_id, user_id)                   -- 한 사람당 레시피 하나에 평가 하나 (upsert로 수정)
);

alter table public.recipe_reviews enable row level security;

-- 그 레시피를 볼 수 있는 사람(= 같은 그룹 멤버)이면 평가도 봅니다.
-- → 부부 둘만의 그룹이면 정확히 그 둘만 서로의 코멘트를 봅니다. "은밀한 둘만" 충족.
create policy "read reviews in my groups" on public.recipe_reviews
  for select using (
    recipe_id in (
      select id from public.recipes where group_id in (select public.my_group_ids())
    )
  );

-- 작성/수정/삭제는 본인 평가만.
create policy "insert own review" on public.recipe_reviews
  for insert with check (user_id = auth.uid());
create policy "update own review" on public.recipe_reviews
  for update using (user_id = auth.uid());
create policy "delete own review" on public.recipe_reviews
  for delete using (user_id = auth.uid());
