import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import koCommon from "./locales/ko/common.json";
import koHome from "./locales/ko/home.json";
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import koOnboarding from "./locales/ko/onboarding.json";
import enOnboarding from "./locales/en/onboarding.json";

export const resources = {
  ko: {
    translation: { common: koCommon, home: koHome, onboarding: koOnboarding },
  },
  en: {
    translation: { common: enCommon, home: enHome, onboarding: enOnboarding },
  },
} as const;

const deviceLang = getLocales()[0]?.languageCode ?? "en";

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLang in resources ? deviceLang : "ko",
  fallbackLng: "ko",
  interpolation: { escapeValue: false },
});

export default i18n;
