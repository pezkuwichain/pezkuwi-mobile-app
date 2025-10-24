import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ku from './locales/ku.json';
import ar from './locales/ar.json';
import tr from './locales/tr.json';
import fa from './locales/fa.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      ku: { translation: ku },
      ar: { translation: ar },
      tr: { translation: tr },
      fa: { translation: fa },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

