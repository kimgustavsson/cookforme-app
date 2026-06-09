import { useMemo, useState } from 'react';
import { ScrollView, TextInput, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RecipeCard } from '../components/RecipeCard';
import { useRecipes } from '../hooks/useRecipes';
import { theme } from '@/theme';

// 제목/재료 텍스트 검색. (TODO: 태그·즐겨찾기 필터 추가)
export function SearchScreen() {
  const nav = useNavigation<any>();
  const recipes = useRecipes();
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const all = recipes.data ?? [];
    if (!q) return all;
    const lower = q.toLowerCase();
    return all.filter(
      (r) => r.title.toLowerCase().includes(lower) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(lower)),
    );
  }, [recipes.data, q]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="레시피·재료 검색" value={q} onChangeText={setQ} />
      {results.map((r) => (
        <RecipeCard key={r.id} recipe={r} onPress={() => nav.navigate('HomeTab', { screen: 'RecipeDetail', params: { recipeId: r.id } })} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10, backgroundColor: theme.colors.background },
  input: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, fontSize: 16, color: theme.colors.text },
});
