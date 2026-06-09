import type { SourceKind } from '@/features/recipes/types';

// URL을 보고 추출 전략을 결정합니다. (이미지는 호출부에서 직접 'image' 지정)
export function detectSourceKind(url: string): Exclude<SourceKind, 'image' | 'manual'> {
  const isYoutube = /(?:youtube\.com|youtu\.be)/i.test(url);
  return isYoutube ? 'youtube' : 'web';
}
