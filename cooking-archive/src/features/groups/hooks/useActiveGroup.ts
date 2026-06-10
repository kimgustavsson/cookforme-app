import { useState } from "react";

// 진단용 임시: mmkv 대신 메모리 상태
export function useActiveGroup() {
  const [activeGroupId, setActiveGroupId] = useState<string | undefined>(
    undefined,
  );
  return { activeGroupId, setActiveGroupId };
}
