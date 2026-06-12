import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from '@/features/auth';
import { useMyGroups, OnboardingScreen } from '@/features/groups';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// ★ 토폴로지의 핵심: 세션 + 그룹 유무로 3갈래 분기.
//   세션 없음            → Auth (로그인/회원가입)
//   세션 있음 + 그룹 0개  → Onboarding
//   세션 있음 + 그룹 1개+ → App (탭)
export function RootNavigator() {
  const { session, isLoading } = useSession();
  // 세션이 있을 때만 그룹을 조회 (enabled로 제어)
  const groups = useMyGroups(!!session);

  // 세션 로딩 중, 또는 (로그인됐는데) 그룹 로딩 중이면 스피너
  if (isLoading || (session && groups.isLoading)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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