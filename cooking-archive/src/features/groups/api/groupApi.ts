import { supabase } from "@/services/supabase";
import type { Group } from "../types";

const mapGroup = (g: any): Group => ({
  id: g.id,
  name: g.name,
  createdBy: g.created_by,
  createdAt: g.created_at,
});

// 내가 속한 그룹들 (RLS가 자동 필터). invite_code도 같이 가져옴.
export async function myGroups(): Promise<Group[]> {
  const { data, error } = await supabase.from("groups").select("*");
  if (error) throw error;
  return (data ?? []).map(mapGroup);
}

export async function createGroup(
  name: string,
): Promise<Group & { inviteCode: string }> {
  const { data, error } = await supabase.rpc("create_group", {
    group_name: name,
  });
  if (error) throw error;
  // RPC가 groups 행을 통째로 돌려줌
  return { ...mapGroup(data), inviteCode: data.invite_code };
}

// This is for users who just want to uset the app solo without creating a group.
// It creates a personal group and returns its id.
export async function createPersonalGroup(): Promise<
  Group & { inviteCode: string }
> {
  return createGroup("My recipes");
}

// ★ 코드로 참여. 안전한 RPC를 호출 → 참여한 그룹 id를 돌려줌.
export async function joinGroupByCode(code: string): Promise<string> {
  const { data, error } = await supabase.rpc("join_group_by_code", { code });
  if (error) {
    // DB에서 raise한 INVALID_CODE를 사람이 읽는 메시지로
    if (error.message.includes("INVALID_CODE")) {
      throw new Error("초대 코드가 올바르지 않아요. 다시 확인해 주세요.");
    }
    throw error;
  }
  return data as string; // 참여한 group_id
}
