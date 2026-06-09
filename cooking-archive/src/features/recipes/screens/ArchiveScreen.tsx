import { ScrollView, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RecipeCard } from '../components/RecipeCard';
import { useRecipes } from '../hooks/useRecipes';
import { theme } from '@/theme';

// 저장한 레시피 전체. "어디 저장했는지 까먹음" 문제의 정답 화면.
export function ArchiveScreen() {
  const nav = useNavigation<any>();
  const recipes = useRecipes();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Archive</Text>
      {recipes.data?.map((r) => (
        <RecipeCard key={r.id} recipe={r} onPress={() => nav.navigate('HomeTab', { screen: 'RecipeDetail', params: { recipeId: r.id } })} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10, backgroundColor: theme.colors.background },
  h1: { fontSize: 24, fontWeight: '700', color: theme.colors.text },
});
