import 'react-i18next';
import type { resources } from './index';

// ★ 타입 안전 키: t('home.titl') 오타나 누락 키를 컴파일 에러로 잡습니다.
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: (typeof resources)['ko'];
  }
}
