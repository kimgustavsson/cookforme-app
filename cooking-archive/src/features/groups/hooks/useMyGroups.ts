import { useQuery } from "@tanstack/react-query";
import { myGroups } from "../api/groupApi";

// 내가 속한 그룹 목록. RootNavigator가 이걸로 "온보딩 vs 홈"을 분기함.
export function useMyGroups() {
  return useQuery({ queryKey: ["myGroups"], queryFn: myGroups });
}
