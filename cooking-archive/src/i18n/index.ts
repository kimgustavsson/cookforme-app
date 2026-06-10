import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import koCommon from "./locales/ko/common.json";
import koHome from "./locales/ko/home.json";
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";

// 모든 파일을 하나의 기본 네임스페이스 안에 키로 합칩니다.
// → t('home.title'), t('common.home') 처럼 점 표기가 그대로 동작.
export const resources = {
  ko: { translation: { common: koCommon, home: koHome } },
  en: { translation: { common: enCommon, home: enHome } },
} as const;

const deviceLang = getLocales()[0]?.languageCode ?? "en";

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLang in resources ? deviceLang : "ko",
  fallbackLng: "ko",
  interpolation: { escapeValue: false },
});

export default i18n;
