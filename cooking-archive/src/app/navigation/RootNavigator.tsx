import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSession } from "@/features/auth";
import { useMyGroups, OnboardingScreen } from "@/features/groups";
import { AuthStack } from "./AuthStack";
import { AppTabs } from "./AppTabs";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { session, isLoading } = useSession();
  const groups = useMyGroups(!!session);

  // 세션 로딩 중이거나, (로그인됐는데) 그룹 데이터를 아직 못 받았으면 스피너.
  // isLoading 대신 data===undefined로 봐야 캐시에 안 속음.
  if (isLoading || (session && groups.data === undefined)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const hasGroup = (groups.data?.length ?? 0) > 0;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!session ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : !hasGroup ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="App" component={AppTabs} />
      )}
    </Stack.Navigator>
  );
}
