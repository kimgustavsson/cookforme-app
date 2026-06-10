import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Button } from '@/components/ui/Button';
import { useRecipe } from '../hooks/useRecipes';
import { theme } from '@/theme';
import type { RecipesStackParamList } from '@/app/navigation/types';

// 요리 모드: 단계별 풀스크린 + 화면 꺼짐 방지 + 큰 글씨.
export function CookModeScreen() {
  useKeepAwake(); // 요리 중 화면이 안 꺼집니다
  const route = useRoute<RouteProp<RecipesStackParamList, 'CookMode'>>();
  const nav = useNavigation();
  const { data: recipe } = useRecipe(route.params.recipeId);
  const [step, setStep] = useState(0);

  if (!recipe) return null;
  const last = step >= recipe.steps.length - 1;

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Step {step + 1} / {recipe.steps.length}</Text>
      <Text style={styles.step}>{recipe.steps[step]}</Text>
      <View style={styles.nav}>
        <Button label="이전" variant="ghost" disabled={step === 0} onPress={() => setStep((s) => s - 1)} />
        {last
          ? <Button label="완료" onPress={() => nav.goBack()} />
          : <Button label="다음" onPress={() => setStep((s) => s + 1)} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 24, backgroundColor: theme.colors.background },
  counter: { fontSize: 16, color: theme.colors.textMuted, textAlign: 'center' },
  step: { fontSize: 26, lineHeight: 38, color: theme.colors.text, textAlign: 'center' },
  nav: { flexDirection: 'row', justifyContent: 'space-between' },
});
