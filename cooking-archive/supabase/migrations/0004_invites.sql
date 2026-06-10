-- (1) groups에 초대 코드 컬럼 추가. 읽기 쉬운 6글자, 그룹마다 유일해야 함.
alter table public.groups
  add column if not exists invite_code text unique;

-- (2) 6글자 코드 생성기. 헷갈리는 문자(0/O, 1/I) 빼고 명확한 것만 사용.
create or replace function public.generate_invite_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; -- 0,O,1,I,L 제외
  result text := '';
  i int;
begin
  for i in 1..6 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$;

-- (3) 새 그룹이 생기면 코드를 자동으로 채워줌 (혹시 중복이면 다시 시도).
create or replace function public.set_invite_code()
returns trigger
language plpgsql
as $$
declare
  new_code text;
  tries int := 0;
begin
  if new.invite_code is null then
    loop
      new_code := public.generate_invite_code();
      exit when not exists (select 1 from public.groups where invite_code = new_code);
      tries := tries + 1;
      exit when tries > 10; -- 무한루프 방지
    end loop;
    new.invite_code := new_code;
  end if;
  return new;
end;
$$;

create trigger groups_set_invite_code
  before insert on public.groups
  for each row execute function public.set_invite_code();

-- (4) ★ 핵심: 코드로 그룹에 참여하는 안전한 함수.
-- SECURITY DEFINER라 RLS를 우회해 코드에 맞는 그룹을 찾을 수 있음.
-- 코드가 없으면 에러, 이미 멤버면 조용히 통과.
create or replace function public.join_group_by_code(code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_group uuid;
begin
  -- 대소문자 구분 없이 코드로 그룹 찾기
  select id into target_group
  from public.groups
  where upper(invite_code) = upper(trim(code));

  if target_group is null then
    raise exception 'INVALID_CODE'; -- 앱에서 "코드가 올바르지 않아요"로 처리
  end if;

  -- 현재 유저를 멤버로 추가 (이미 있으면 무시)
  insert into public.group_members (group_id, user_id)
  values (target_group, auth.uid())
  on conflict (group_id, user_id) do nothing;

  return target_group;
end;
$$;