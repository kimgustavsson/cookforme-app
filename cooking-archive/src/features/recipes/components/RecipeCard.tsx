import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '@/theme';
import type { Recipe } from '../types';

// 목록의 레시피 한 줄. expo-image가 본 썸네일만 디스크 캐시 (오프라인).
export function RecipeCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {recipe.image ? (
        <Image source={recipe.image} style={styles.thumb} cachePolicy="disk" contentFit="cover" />
      ) : (
        <View style={[styles.thumb, styles.placeholder]} />
      )}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{recipe.title}</Text>
        <Text style={styles.meta}>
          {recipe.ingredients.length} ingredients · serves {recipe.servings ?? '-'}
        </Text>
        {recipe.status === 'draft' && <Text style={styles.draft}>임시저장 (확인 필요)</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, padding: 12, backgroundColor: theme.colors.surface, borderRadius: 16 },
  thumb: { width: 56, height: 56, borderRadius: 12 },
  placeholder: { backgroundColor: theme.colors.border },
  body: { flex: 1, justifyContent: 'center', gap: 2 },
  title: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  meta: { fontSize: 13, color: theme.colors.textMuted },
  draft: { fontSize: 12, color: theme.colors.accent },
});
