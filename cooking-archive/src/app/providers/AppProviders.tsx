import { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, queryPersister } from '@/services/queryClient';
import '@/i18n'; // i18next 초기화 (import 시 실행)

// 모든 전역 컨텍스트를 한 곳에 모읍니다.
// 나중에 테마 프로바이더 등을 추가해도 여기만 건드리면 됩니다.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: queryPersister }}
      >
        <NavigationContainer>{children}</NavigationContainer>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
