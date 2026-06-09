// 모든 입력 소스(웹/유튜브/이미지/직접입력)가 결국 이 하나의 Recipe로 수렴합니다.
// 앱은 레시피가 "어디서 왔는지" 몰라도 됩니다.

export type SourceKind = 'web' | 'youtube' | 'image' | 'manual';
export type RecipeStatus = 'draft' | 'saved';
// 관계가 아니라 "상태". private = 나만, shared = 다른 유저도 볼 수 있음.
export type Visibility = 'private' | 'shared';

export interface Ingredient {
  name: string;
  quantity?: string;
}

export interface Recipe {
  id: string;
  ownerId: string; // 누가 만들었나 — 개별 유저. 가족/그룹 개념 없음.
  sourceKind: SourceKind;
  sourceUrl?: string; // 있으면 링크 공유 / 없으면 이미지 공유
  title: string;
  image?: string;
  servings?: number;
  ingredients: Ingredient[];
  steps: string[];
  status: RecipeStatus; // draft = 링크만 저장 / saved = 확인 완료
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
}

// 백엔드 /extract 에 보내는 입력. kind로 추출 전략이 갈립니다.
export type RecipeSource =
  | { kind: 'web'; url: string }
  | { kind: 'youtube'; url: string }
  | { kind: 'image'; base64: string };

// /extract 가 돌려주는 결과. 부분 실패 가능 → 사용자가 확인/편집.
export interface ExtractResult {
  title?: string;
  image?: string;
  servings?: number;
  ingredients: Ingredient[];
  steps: string[];
  sourceUrl?: string;
  partial: boolean; // true면 일부 필드를 못 긁었다는 뜻 → 확인 화면에서 보정
}
