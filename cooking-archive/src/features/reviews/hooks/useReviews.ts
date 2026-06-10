import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listReviews, upsertMyReview } from '../api/reviewApi';

export function useReviews(recipeId: string) {
  return useQuery({ queryKey: ['reviews', recipeId], queryFn: () => listReviews(recipeId) });
}

export function useUpsertReview(recipeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertMyReview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', recipeId] }),
  });
}
