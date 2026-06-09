import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from '@/features/auth';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// ★ 토폴로지의 핵심: 세션 상태로 분기합니다.
//   로딩 중       → Splash
//   세션 없음     → Auth (Login/SignUp)
//   세션 있음     → App  (탭)
// 나중에 스플래시/회원가입을 채워도 이 분기 구조는 그대로입니다.
export function RootNavigator() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
