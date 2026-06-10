import { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { signUp } from '../api/authApi';
import { theme } from '@/theme';

export function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    try { await signUp(email, pw); } catch (e: any) { setError(e.message); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>회원가입</Text>
      <TextInput style={styles.input} placeholder="이메일" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry value={pw} onChangeText={setPw} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button label="가입" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: 'center', backgroundColor: theme.colors.background },
  h1: { fontSize: 26, fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
  input: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 14, fontSize: 16, color: theme.colors.text },
  error: { color: theme.colors.danger, fontSize: 13 },
});
