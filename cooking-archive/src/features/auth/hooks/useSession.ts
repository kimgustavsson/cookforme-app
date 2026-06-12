import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/services/supabase";

// 현재 세션을 구독. 로그인/로그아웃 시 그룹 캐시도 비워 상태 어긋남을 막음.
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      // 로그인/로그아웃 시 이전 계정의 그룹 캐시를 제거
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        queryClient.removeQueries({ queryKey: ["myGroups"] });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient]);

  return { session, isLoading };
}
