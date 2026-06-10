import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Supabase = 인증 + DB + 이미지 스토리지 + RLS.
// anon key는 공개되어도 RLS가 데이터를 보호하므로 앱에 넣어도 됩니다.
const url = Constants.expoConfig?.extra?.supabaseUrl as string;
const anonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
