import { GoogleAuthProvider } from 'firebase/auth';
import getEnv from '~/core/get-env';

const env = getEnv() ?? {};

const configuration = {
  site: {
    name: 'Awesomely - Your SaaS Title',
    description: 'Your SaaS Description',
    themeColor: '#ffffff',
    themeColorDark: '#0a0a0a',
    siteUrl: env.SITE_URL,
    siteName: 'Awesomely',
    twitterHandle: '',
    githubHandle: '',
    language: 'en',
    convertKitFormId: '',
    locale: env.DEFAULT_LOCALE,
  },
  auth: {
    // Enable MFA. You must upgrade to GCP Identity Platform to use it.
    // see: https://cloud.google.com/identity-platform/docs/product-comparison
    enableMultiFactorAuth: false,
    // NB: Enable the providers below in the Firebase Console
    // in your production project
    providers: {
      emailPassword: true,
      phoneNumber: false,
      emailLink: false,
      oAuth: [GoogleAuthProvider],
    },
  },
  emulatorHost: env.EMULATOR_HOST,
  emulator: env.EMULATOR === 'true',
  production: env.NODE_ENV === 'production',
  environment: env.ENVIRONMENT,
  paths: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    emailLinkSignIn: '/auth/link',
    onboarding: `/onboarding`,
    appHome: '/dashboard',
    settings: {
      profile: '/settings/profile',
      authentication: '/settings/profile/authentication',
      email: '/settings/profile/email',
      password: '/settings/profile/password',
    },
    api: {
      checkout: `/stripe/checkout`,
      billingPortal: `/stripe/portal`,
    },
    searchIndex: `/public/search-index`,
  },
  appCheckSiteKey: env.APPCHECK_KEY,
  email: {
    host: '',
    port: 587,
    user: '',
    password: '',
    senderAddress: 'MakerKit Team <info@makerkit.dev>',
  },
  sentry: {
    dsn: env.SENTRY_DSN,
  },
  stripe: {
    plans: [
      {
        name: 'Basic',
        description: 'Description of your Basic plan',
        price: '$9/month',
        stripePriceId: 'price_1LfXGaI1i3VnbZTq7l3VgZNa',
        trialPeriodDays: 0,
        features: [
          'Basic Reporting',
          'Up to 20 users',
          '1GB for each user',
          'Chat Support',
        ],
      },
      {
        name: 'Pro',
        description: 'Description of your Pro plan',
        price: '29/month',
        stripePriceId: 'pro-plan',
        features: [
          'Advanced Reporting',
          'Up to 50 users',
          '5GB for each user',
          'Chat and Phone Support',
        ],
      },
      {
        name: 'Premium',
        description: 'Description of your Premium plan',
        price: '$79/year',
        stripePriceId: 'premium-plan',
        features: [
          'Advanced Reporting',
          'Unlimited users',
          '50GB for each user',
          'Account Manager',
        ],
      },
    ],
  },
};

export default configuration;
