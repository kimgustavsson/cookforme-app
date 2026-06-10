import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';

// 단계 목록. (스케치 ③ 의 Step 1, Step 2 … 구조)
export function StepList({ steps }: { steps: string[] }) {
  return (
    <View style={{ gap: 12 }}>
      {steps.map((step, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{i + 1}</Text>
          </View>
          <Text style={styles.text}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  badge: { width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 13, fontWeight: '600', color: theme.colors.accent },
  text: { flex: 1, fontSize: 16, lineHeight: 24, color: theme.colors.text },
});
