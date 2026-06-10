import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from './providers/AppProviders';
import { RootNavigator } from './navigation/RootNavigator';

// 앱 진입점. 전역 프로바이더로 감싸고 네비게이션을 렌더링하는 게 전부입니다.
export default function App() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProviders>
  );
}
