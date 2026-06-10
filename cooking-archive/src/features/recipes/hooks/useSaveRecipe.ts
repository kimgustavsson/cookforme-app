import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertRecipe, deleteRecipe } from '../api/recipeDbApi';
import type { Recipe } from '../types';

// 저장/수정/삭제. 성공하면 목록 쿼리를 무효화해 화면이 자동 갱신됩니다.
export function useSaveRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recipe: Partial<Recipe> & { id?: string }) => upsertRecipe(recipe),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes'] }),
  });
}

export function useDeleteRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes'] }),
  });
}
