import { supabase } from '@/services/supabase';

// 인증 API. signUp/signIn/signOut + deleteAccount.
export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUp(email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}

// ★ 애플 심사 필수: 앱 안에서 계정+데이터를 삭제할 수 있어야 합니다.
// 실제 삭제는 서비스 롤 권한이 필요하므로 백엔드(Edge Function)에서 수행합니다.
export async function deleteAccount() {
  const { error } = await supabase.functions.invoke('delete-account');
  if (error) throw error;
  await supabase.auth.signOut();
}
