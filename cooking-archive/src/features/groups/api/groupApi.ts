import { supabase } from '@/services/supabase';
import type { Group } from '../types';

// 내가 속한 그룹들 (RLS가 자동 필터).
export async function myGroups(): Promise<Group[]> {
  const { data, error } = await supabase.from('groups').select('*');
  if (error) throw error;
  return (data ?? []).map((g) => ({ id: g.id, name: g.name, createdBy: g.created_by, createdAt: g.created_at }));
}

// 새 그룹 만들기 → 만든 사람을 멤버로 추가 (UX 흐름 1: "새 그룹 만들기").
export async function createGroup(name: string): Promise<Group> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('groups').insert({ name, created_by: user!.id }).select().single();
  if (error) throw error;
  await supabase.from('group_members').insert({ group_id: data.id, user_id: user!.id });
  return { id: data.id, name: data.name, createdBy: data.created_by, createdAt: data.created_at };
}

// "기존 그룹 참여하기": 지금은 group_id 직접 가입. (TODO: 초대 코드 검증 RPC로 안전하게)
export async function joinGroup(groupId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('group_members').insert({ group_id: groupId, user_id: user!.id });
  if (error) throw error;
}
