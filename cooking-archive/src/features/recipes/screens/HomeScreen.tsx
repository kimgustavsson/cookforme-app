import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RecipeLinkInput } from '../components/RecipeLinkInput';
import { PhotoCaptureCard } from '../components/PhotoCaptureCard';
import { RecipeCard } from '../components/RecipeCard';
import { useRecipes } from '../hooks/useRecipes';
import { useScrapeRecipe } from '../hooks/useScrapeRecipe';
import { useSaveRecipe } from '../hooks/useSaveRecipe';
import { detectSourceKind } from '@/utils/detectSourceKind';
import { useActiveGroup } from '@/features/groups';
import { theme } from '@/theme';
import type { RecipesStackParamList } from '@/app/navigation/types';

type Nav = NativeStackNavigationProp<RecipesStackParamList, 'Home'>;

// 스케치 ① 랜딩. 링크/사진 입력 → 추출 → 확인 화면으로 이동.
export function HomeScreen() {
  const { t } = useTranslation();
  const nav = useNavigation<Nav>();
  const recipes = useRecipes();
  const scrape = useScrapeRecipe();
  const save = useSaveRecipe();
  const { activeGroupId } = useActiveGroup();

  async function handleSource(input: { url?: string; base64?: string }) {
    // 1) 소스 종류 판별 → 2) 추출 → 3) draft로 저장 → 4) 확인 화면으로
    const source = input.url
      ? { kind: detectSourceKind(input.url), url: input.url }
      : { kind: 'image' as const, base64: input.base64! };
    const result = await scrape.mutateAsync(source as any);
    const draft = await save.mutateAsync({
      groupId: activeGroupId!,          // 현재 활성 그룹에 저장 (남편 그룹 / 가족 그룹 등)
      sourceKind: (source as any).kind,
      sourceUrl: input.url,
      title: result.title ?? '제목 없음',
      ingredients: result.ingredients,
      steps: result.steps,
      image: result.image,
      servings: result.servings,
      status: 'draft',
    });
    nav.navigate('RecipeReview', { recipeId: draft.id });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>{t('home.title')}</Text>

      <Text style={styles.label}>{t('home.recipeLink')}</Text>
      <RecipeLinkInput onSubmit={(url) => handleSource({ url })} />

      <Text style={styles.label}>{t('home.photo')}</Text>
      <PhotoCaptureCard onPick={(base64) => handleSource({ base64 })} />

      {scrape.isPending && <ActivityIndicator style={{ marginVertical: 12 }} />}

      <Text style={styles.label}>{t('home.recipes')}</Text>
      {recipes.data?.map((r) => (
        <RecipeCard key={r.id} recipe={r} onPress={() => nav.navigate('RecipeDetail', { recipeId: r.id })} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10, backgroundColor: theme.colors.background },
  h1: { fontSize: 26, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  label: { fontSize: 15, fontWeight: '600', color: theme.colors.text, marginTop: 8 },
});
