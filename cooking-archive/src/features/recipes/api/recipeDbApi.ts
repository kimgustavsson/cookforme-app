import { supabase } from '@/services/supabase';
import type { Recipe } from '../types';

// Supabase CRUD. RLS 정책이 "내 것 + shared 것"만 보이도록 DB에서 강제하므로
// 앱 코드에서 권한 필터를 직접 짤 필요가 없습니다.
const TABLE = 'recipes';

export async function listRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getRecipe(id: string): Promise<Recipe> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function upsertRecipe(recipe: Partial<Recipe> & { id?: string }): Promise<Recipe> {
  const { data, error } = await supabase.from(TABLE).upsert(recipe).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
