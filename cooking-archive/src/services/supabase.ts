import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage, // ★ 세션을 AsyncStorage에 저장 → 요청마다 유지됨
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // RN에선 URL 세션 감지 끔
  },
});
