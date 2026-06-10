import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import koCommon from './locales/ko/common.json';
import koHome from './locales/ko/home.json';
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';

// 네임스페이스로 쪼갠 JSON을 합칩니다. 새 화면 = 새 파일 추가.
export const resources = {
  ko: { common: koCommon, home: koHome },
  en: { common: enCommon, home: enHome },
} as const;

// 기기 언어 자동 감지 (부모님=한국어, 친구=영어 자동 대응). 없으면 한국어.
const deviceLang = getLocales()[0]?.languageCode ?? 'ko';

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLang in resources ? deviceLang : 'ko',
  fallbackLng: 'ko',
  defaultNS: 'common',
  ns: ['common', 'home'],
  interpolation: { escapeValue: false },
});

export default i18n;
