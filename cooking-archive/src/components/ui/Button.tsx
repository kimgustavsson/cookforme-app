import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';

type Variant = 'primary' | 'ghost' | 'danger';

// 공용 버튼. feature들이 공유하는 UI는 전부 여기(components/ui)에 둡니다.
export function Button({
  label, onPress, disabled, variant = 'primary',
}: { label: string; onPress: () => void; disabled?: boolean; variant?: Variant }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, styles[variant], disabled && styles.disabled]}
    >
      <Text style={[styles.label, variant === 'primary' ? styles.labelLight : styles.labelDark]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: theme.colors.accent },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: theme.colors.dangerSoft },
  disabled: { opacity: 0.4 },
  label: { fontSize: 15, fontWeight: '600' },
  labelLight: { color: '#fff' },
  labelDark: { color: theme.colors.accent },
});
