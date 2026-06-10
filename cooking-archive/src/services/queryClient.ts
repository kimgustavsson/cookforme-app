import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { storage } from './storage';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } },
});

// TanStack Query 결과를 MMKV에 영속화 → 오프라인에서도 마지막 텍스트 데이터 표시.
// (이미지는 여기서 캐시하지 않습니다. expo-image가 본 것만 디스크 캐시.)
export const queryPersister = createAsyncStoragePersister({
  storage: {
    getItem: (k) => storage.getString(k) ?? null,
    setItem: (k, v) => storage.set(k, v),
    removeItem: (k) => storage.delete(k),
  },
});
