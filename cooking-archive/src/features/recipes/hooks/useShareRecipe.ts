import { Share } from 'react-native';
import type { Recipe } from '../types';

// 외부 공유. 소스에 따라 분기합니다.
//   sourceUrl 있음(웹/유튜브) → 원본 링크 공유 (재배포 아님, 그냥 가리키기)
//   없음(사진/직접입력)        → 본인이 만든 내용이므로 텍스트로 공유
// (이미지/PDF 렌더 공유는 나중에 같은 분기 안에서 확장)
export function useShareRecipe() {
  return async function share(recipe: Recipe) {
    if (recipe.sourceUrl) {
      await Share.share({ message: `${recipe.title}\n${recipe.sourceUrl}`, url: recipe.sourceUrl });
      return;
    }
    const body = [
      recipe.title,
      '',
      ...recipe.ingredients.map((i) => `• ${i.quantity ?? ''} ${i.name}`.trim()),
      '',
      ...recipe.steps.map((s, idx) => `${idx + 1}. ${s}`),
    ].join('\n');
    await Share.share({ message: body });
  };
}
