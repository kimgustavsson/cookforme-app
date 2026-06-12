import { useQuery } from "@tanstack/react-query";
import { myGroups } from "../api/groupApi";

// enabled: 세션이 있을 때만 조회 (로그아웃 상태에선 안 부름)

// useMyGroups(!!session) → 세션이 있으면 true → 조회 활성화
export function useMyGroups(enabled = true) {
  return useQuery({
    queryKey: ["myGroups"],
    queryFn: myGroups,
    enabled,
  });
}
