import { supabase } from '@/services/supabase';
import type { RecipeSource, ExtractResult } from '../types';

// 앱은 백엔드 /extract 엔드포인트 "하나"만 호출합니다.
// 웹/유튜브/이미지 분기, AI 호출, API 키는 전부 백엔드 안에 있습니다.
// → 추출 규칙이 바뀌어도 앱 재배포가 필요 없습니다.
export async function extractRecipe(source: RecipeSource): Promise<ExtractResult> {
  const { data, error } = await supabase.functions.invoke<ExtractResult>('extract', {
    body: source,
  });
  if (error) throw error;
  if (!data) throw new Error('추출 결과가 비어 있습니다.');
  return data;
}
