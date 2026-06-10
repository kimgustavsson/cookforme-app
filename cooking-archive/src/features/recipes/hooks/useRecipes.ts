import { useQuery } from '@tanstack/react-query';
import { listRecipes, getRecipe } from '../api/recipeDbApi';

// 목록/단건 조회. PersistQueryClient가 결과를 MMKV에 캐시하므로
// 오프라인에서도 마지막으로 받은 "텍스트" 레시피는 그대로 보입니다.
export function useRecipes() {
  return useQuery({ queryKey: ['recipes'], queryFn: listRecipes });
}

export function useRecipe(id: string) {
  return useQuery({ queryKey: ['recipes', id], queryFn: () => getRecipe(id) });
}
