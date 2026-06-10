import { supabase } from '@/services/supabase';
import type { RecipeReview } from '../types';

const map = (r: any): RecipeReview => ({
  id: r.id, recipeId: r.recipe_id, userId: r.user_id,
  rating: r.rating, comment: r.comment ?? undefined,
  cookedAt: r.cooked_at ?? undefined, createdAt: r.created_at,
});

// 한 레시피의 모든 평가 (RLS: 같은 그룹 멤버 것만 보임 → 부부 둘만이면 둘 것만).
export async function listReviews(recipeId: string): Promise<RecipeReview[]> {
  const { data, error } = await supabase
    .from('recipe_reviews').select('*').eq('recipe_id', recipeId);
  if (error) throw error;
  return (data ?? []).map(map);
}

// 내 평가 저장/수정. unique(recipe_id,user_id) 덕분에 upsert가 곧 "수정"이 됩니다.
export async function upsertMyReview(input: {
  recipeId: string; rating: number; comment?: string; cookedAt?: string;
}): Promise<RecipeReview> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('recipe_reviews')
    .upsert({
      recipe_id: input.recipeId, user_id: user!.id,
      rating: input.rating, comment: input.comment, cooked_at: input.cookedAt,
    }, { onConflict: 'recipe_id,user_id' })
    .select().single();
  if (error) throw error;
  return map(data);
}
