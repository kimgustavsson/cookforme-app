import { ScrollView, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Button } from '@/components/ui/Button';
import { IngredientList } from '../components/IngredientList';
import { StepList } from '../components/StepList';
import { useRecipe } from '../hooks/useRecipes';
import { useSaveRecipe } from '../hooks/useSaveRecipe';
import { theme } from '@/theme';
import type { RecipesStackParamList } from '@/app/navigation/types';

// 저장 전 "이거 맞아요?" 확인 단계. 부분 실패한 추출을 사용자가 보정합니다.
// (TODO: 필드 인라인 편집 추가 — 현재는 확인/확정만)
export function RecipeReviewScreen() {
  const route = useRoute<RouteProp<RecipesStackParamList, 'RecipeReview'>>();
  const nav = useNavigation<any>();
  const { data: recipe } = useRecipe(route.params.recipeId);
  const save = useSaveRecipe();

  if (!recipe) return null;

  async function confirm() {
    await save.mutateAsync({ id: recipe.id, status: 'saved' }); // draft → saved
    nav.navigate('RecipeDetail', { recipeId: recipe.id });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>{recipe.title}</Text>
      <Text style={styles.section}>재료</Text>
      <IngredientList ingredients={recipe.ingredients} baseServings={recipe.servings} servings={recipe.servings} />
      <Text style={styles.section}>조리 순서</Text>
      <StepList steps={recipe.steps} />
      <Button label="이대로 저장" onPress={confirm} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12, backgroundColor: theme.colors.background },
  h1: { fontSize: 22, fontWeight: '700', color: theme.colors.text },
  section: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginTop: 8 },
});
