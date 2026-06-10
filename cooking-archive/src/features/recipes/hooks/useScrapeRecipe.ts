import { useMutation } from '@tanstack/react-query';
import { extractRecipe } from '../api/recipeExtractApi';
import type { RecipeSource } from '../types';

// 비동기 추출(서버 상태)은 mutation으로. 로딩/에러/재시도가 공짜로 따라옵니다.
// 화면에서: const scrape = useScrapeRecipe(); scrape.mutate(source);
export function useScrapeRecipe() {
  return useMutation({
    mutationFn: (source: RecipeSource) => extractRecipe(source),
  });
}
