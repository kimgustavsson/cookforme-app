import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 32, alignItems: 'center', gap: 6 },
  title: { fontSize: 16, color: theme.colors.text },
  hint: { fontSize: 13, color: theme.colors.textMuted, textAlign: 'center' },
});
