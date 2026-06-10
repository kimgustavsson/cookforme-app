import { supabase } from '@/services/supabase';
import { mapRecipeRow, type Recipe } from '../types';

// Supabase CRUD. RLS(my_group_ids 기반)가 "내 그룹 레시피"만 보이게 DB에서 강제하므로
// 앱에서 group 필터를 직접 짤 필요가 없습니다. select('*')만 해도 알아서 걸러집니다.
const TABLE = 'recipes';

export async function listRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRecipeRow);
}

export async function getRecipe(id: string): Promise<Recipe> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return mapRecipeRow(data);
}

// 저장 입력은 snake_case 컬럼으로 변환해서 넣습니다.
export type RecipeInput = {
  id?: string;
  groupId: string;
  sourceKind: Recipe['sourceKind'];
  sourceUrl?: string;
  title: string;
  image?: string;
  servings?: number;
  ingredients: Recipe['ingredients'];
  steps: string[];
  status: Recipe['status'];
};

export async function upsertRecipe(input: Partial<RecipeInput> & { id?: string }): Promise<Recipe> {
  const row: any = {
    id: input.id, group_id: input.groupId, source_kind: input.sourceKind,
    source_url: input.sourceUrl, title: input.title, image_url: input.image,
    servings: input.servings, ingredients: input.ingredients, steps: input.steps,
    status: input.status, updated_at: new Date().toISOString(),
  };
  Object.keys(row).forEach((k) => row[k] === undefined && delete row[k]);
  const { data, error } = await supabase.from(TABLE).upsert(row).select().single();
  if (error) throw error;
  return mapRecipeRow(data);
}

export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
