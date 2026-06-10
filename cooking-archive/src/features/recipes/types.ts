// 레시피는 "그룹"에 귀속됩니다. (개인 = 멤버 1명짜리 그룹으로 처리하면 visibility 플래그가 사라짐)
export type SourceKind = 'web' | 'youtube' | 'image' | 'manual';
export type RecipeStatus = 'draft' | 'saved';

export interface Ingredient { name: string; quantity?: string; }

export interface Recipe {
  id: string;
  groupId: string;       // 어느 그룹 냉장고에 붙어있나 (RLS가 이걸로 접근 제어)
  createdBy: string;     // 누가 올렸나 (기록용, 관계 아님)
  sourceKind: SourceKind;
  sourceUrl?: string;
  title: string;
  image?: string;
  servings?: number;
  ingredients: Ingredient[];
  steps: string[];
  status: RecipeStatus;
  createdAt: string;
  updatedAt: string;
}

export type RecipeSource =
  | { kind: 'web'; url: string }
  | { kind: 'youtube'; url: string }
  | { kind: 'image'; base64: string };

export interface ExtractResult {
  title?: string;
  image?: string;
  servings?: number;
  ingredients: Ingredient[];
  steps: string[];
  sourceUrl?: string;
  partial: boolean;
}

// DB는 snake_case, 앱은 camelCase. 경계에서 한 번만 변환합니다.
export function mapRecipeRow(r: any): Recipe {
  return {
    id: r.id, groupId: r.group_id, createdBy: r.created_by,
    sourceKind: r.source_kind, sourceUrl: r.source_url ?? undefined,
    title: r.title, image: r.image_url ?? undefined, servings: r.servings ?? undefined,
    ingredients: r.ingredients ?? [], steps: r.steps ?? [],
    status: r.status, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
