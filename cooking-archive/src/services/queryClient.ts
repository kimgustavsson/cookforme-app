import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { storage } from "./storage";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } },
});

// AsyncStorage를 그대로 넘기면 됨 (getItem/setItem/removeItem을 이미 가짐)
export const queryPersister = createAsyncStoragePersister({
  storage,
});
