import { useState, useEffect } from "react";
import { storage } from "@/services/storage";

const KEY = "activeGroupId";

// 활성 그룹 id를 AsyncStorage에 저장/복원. 앱을 껐다 켜도 유지됨.
export function useActiveGroup() {
  const [activeGroupId, setId] = useState<string | undefined>(undefined);

  // 앱 시작 시 저장된 값 복원
  useEffect(() => {
    storage.getItem(KEY).then((v) => setId(v ?? undefined));
  }, []);

  // 값을 바꾸면 상태 + 저장소 둘 다 갱신
  const setActiveGroupId = (id: string | undefined) => {
    setId(id);
    if (id) storage.setItem(KEY, id);
    else storage.removeItem(KEY);
  };

  return { activeGroupId, setActiveGroupId };
}
