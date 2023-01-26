import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { getInitialNamespaces } from 'remix-i18next';
import i18n from './i18next.config';

function initializeClientI18n() {
  return i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
      ...i18n,
      ns: [...i18n.defaultNS, ...getInitialNamespaces()],
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      detection: {
        order: ['htmlTag'],
        caches: [],
      },
    })
    .then(() => i18next);
}

export default initializeClientI18n;
