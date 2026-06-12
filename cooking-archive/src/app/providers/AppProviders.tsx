import { ReactNode } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import Toast from "react-native-toast-message";
import { queryClient, queryPersister } from "@/services/queryClient";
import "@/i18n";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: queryPersister }}
      >
        <NavigationContainer>{children}</NavigationContainer>
      </PersistQueryClientProvider>
      {/* ★ Toast message should be displayed above all other components */}
      <Toast />
    </SafeAreaProvider>
  );
}
