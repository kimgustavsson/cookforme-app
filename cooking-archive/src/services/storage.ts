import { MMKV } from 'react-native-mmkv';

// 빠른 동기 키-값 저장소. 오프라인 캐시 영속에 사용합니다.
export const storage = new MMKV({ id: 'cooking-archive' });
