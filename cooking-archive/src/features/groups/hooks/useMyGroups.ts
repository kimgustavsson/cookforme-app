import { useQuery } from "@tanstack/react-query";
import { myGroups } from "../api/groupApi";

export function useMyGroups(enabled = true) {
  return useQuery({
    queryKey: ["myGroups"],
    queryFn: myGroups,
    enabled,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
