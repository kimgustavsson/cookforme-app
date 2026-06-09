import { ExpoConfig, ConfigContext } from 'expo/config';

// 앱 메타데이터 + 스토어 심사에 필요한 권한 문구가 여기 모입니다.
// 권한 설명을 비워두면 iOS 심사에서 즉시 반려되므로 명확히 적습니다.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Cooking Archive',
  slug: 'cooking-archive',
  scheme: 'cookingarchive',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#FBF7EC',
  },
  ios: {
    bundleIdentifier: 'com.example.cookingarchive',
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription:
        '레시피를 사진으로 찍어 저장하기 위해 카메라를 사용합니다.',
      NSPhotoLibraryUsageDescription:
        '책·신문 등의 레시피 사진을 불러오기 위해 사진첩에 접근합니다.',
    },
  },
  android: {
    package: 'com.example.cookingarchive',
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#FBF7EC' },
    permissions: ['CAMERA', 'READ_MEDIA_IMAGES'],
  },
  plugins: ['expo-localization', 'expo-image-picker'],
  extra: {
    // 앱에는 공개 가능한 값만. 비밀 키는 백엔드(Supabase)에만 둡니다.
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
});
