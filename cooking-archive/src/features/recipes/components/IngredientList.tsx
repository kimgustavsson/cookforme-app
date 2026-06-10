import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import type { Ingredient } from '../types';

// 인분 스케일 + 체크오프. baseServings 대비 servings 비율로 수량을 재계산합니다.
export function IngredientList({
  ingredients, baseServings = 1, servings = baseServings,
}: { ingredients: Ingredient[]; baseServings?: number; servings?: number }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const factor = baseServings > 0 ? servings / baseServings : 1;

  const scaled = useMemo(
    () => ingredients.map((ing) => ({ ...ing, quantity: scaleQuantity(ing.quantity, factor) })),
    [ingredients, factor],
  );

  return (
    <View style={{ gap: 4 }}>
      {scaled.map((ing, i) => (
        <Pressable key={i} style={styles.row} onPress={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}>
          <Text style={styles.box}>{checked[i] ? '☑' : '☐'}</Text>
          <Text style={[styles.text, checked[i] && styles.done]}>
            {ing.quantity ? `${ing.quantity} ` : ''}{ing.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// 숫자가 들어있으면 비율로 곱합니다. ("2 cups" → 4인분이면 "4 cups")
function scaleQuantity(q: string | undefined, factor: number): string | undefined {
  if (!q || factor === 1) return q;
  return q.replace(/[\d.]+/g, (n) => String(+(parseFloat(n) * factor).toFixed(2)));
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  box: { fontSize: 16, color: theme.colors.accent },
  text: { fontSize: 16, color: theme.colors.text, flex: 1 },
  done: { textDecorationLine: 'line-through', color: theme.colors.textMuted },
});
