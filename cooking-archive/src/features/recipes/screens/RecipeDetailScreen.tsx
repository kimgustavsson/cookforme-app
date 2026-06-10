import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Button } from '@/components/ui/Button';
import { IngredientList } from '../components/IngredientList';
import { StepList } from '../components/StepList';
import { useRecipe } from '../hooks/useRecipes';
import { useShareRecipe } from '../hooks/useShareRecipe';
import { theme } from '@/theme';
import type { RecipesStackParamList } from '@/app/navigation/types';

// 스케치 ③ 상세 화면. 우상단의 공유/편집 + 요리 모드 진입.
export function RecipeDetailScreen() {
  const route = useRoute<RouteProp<RecipesStackParamList, 'RecipeDetail'>>();
  const nav = useNavigation<any>();
  const { data: recipe } = useRecipe(route.params.recipeId);
  const share = useShareRecipe();

  if (!recipe) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.actions}>
        {/* sourceUrl 유무로 링크/텍스트 공유가 자동 분기됩니다 */}
        <Button label="공유" variant="ghost" onPress={() => share(recipe)} />
        <Button label="요리 시작" onPress={() => nav.navigate('CookMode', { recipeId: recipe.id })} />
      </View>
      <Text style={styles.h1}>{recipe.title}</Text>
      <Text style={styles.section}>재료</Text>
      <IngredientList ingredients={recipe.ingredients} baseServings={recipe.servings} servings={recipe.servings} />
      <Text style={styles.section}>조리 순서</Text>
      <StepList steps={recipe.steps} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12, backgroundColor: theme.colors.background },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  h1: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
  section: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginTop: 8 },
});
