import isBrowser from '~/core/generic/is-browser';

const env = isBrowser() ? window.ENV : process.env;
const DEFAULT_LOCALE = env.DEFAULT_LOCALE ?? 'en';

const i18Config = {
  fallbackLanguage: DEFAULT_LOCALE,
  supportedLanguages: [DEFAULT_LOCALE],
  defaultNS: ['common', 'auth', 'organization', 'profile', 'subscription', 'task'],
  react: { useSuspense: false },
};

export default i18Config;
