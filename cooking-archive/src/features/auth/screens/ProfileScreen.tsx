import { Alert, View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { signOut, deleteAccount } from '../api/authApi';
import { theme } from '@/theme';

// 프로필/설정 탭. 로그아웃 + 계정 삭제(심사 필수).
export function ProfileScreen() {
  function confirmDelete() {
    Alert.alert('계정 삭제', '모든 레시피가 영구 삭제됩니다. 계속할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => deleteAccount() },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>설정</Text>
      <Button label="로그아웃" variant="ghost" onPress={() => signOut()} />
      <Button label="계정 삭제" variant="danger" onPress={confirmDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, backgroundColor: theme.colors.background },
  h1: { fontSize: 24, fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
});
