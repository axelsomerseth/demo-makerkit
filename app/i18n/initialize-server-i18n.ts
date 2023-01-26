import type { EntryContext } from '@remix-run/node';
import { resolve } from 'node:path';

import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import { initReactI18next } from 'react-i18next';
import i18next from './i18n.server';
import i18n from './i18next.config';

async function initializeServerI18n(request: Request, context: EntryContext) {
  const instance = createInstance();
  const lng = await i18next.getLocale(request);
  const ns = [...i18n.defaultNS, ...i18next.getRouteNamespaces(context)];

  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18n,
      lng,
      ns,
      backend: {
        loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
      },
    });

  return instance;
}

export default initializeServerI18n;
