import { defineConfig } from 'cypress';
import { resolve } from 'path';
import { config as loadEnv } from 'dotenv';

const environmentVariables = loadEnv({
  path: resolve(process.cwd(), '.env.test'),
});

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './cypress/fixtures',
  video: false,
  chromeWebSecurity: false,
  port: 4600,
  viewportWidth: 1920,
  viewportHeight: 1080,
  pageLoadTimeout: 60000,
  retries: {
    runMode: 2,
    openMode: 1,
  },
  env: getEnv(),
  e2e: {
    setupNodeEvents(on, config) {
      const env = {
        ...(config.env ?? {}),
        ...(environmentVariables.parsed ?? {}),
      };

      const port = 3000;

      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
        video: false,
        screenshotOnRunFailure: !process.env.CI,
      };

      return {
        ...config,
        ...configOverrides,
        env,
      };
    },
    defaultCommandTimeout: 10000,
    slowTestThreshold: 5000,
    specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: getExcludeSpecPattern(),
  },
});

function getExcludeSpecPattern() {
  const enableStripeTests = process.env.ENABLE_STRIPE_TESTING === 'true';

  return enableStripeTests ? [] : ['**/stripe/*'];
}

function getEnv() {
  const env = process.env;

  const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;
  const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID;
  const FIREBASE_API_KEY = env.FIREBASE_API_KEY;
  const FIREBASE_APP_ID = env.FIREBASE_APP_ID;
  const FIREBASE_STORAGE_BUCKET = env.FIREBASE_STORAGE_BUCKET;
  const FIREBASE_EMULATOR_HOST = env.FIREBASE_EMULATOR_HOST;

  const FIREBASE_AUTH_EMULATOR_PORT = env.FIREBASE_AUTH_EMULATOR_PORT;

  const USER_EMAIL = env.USER_EMAIL;
  const USER_PASSWORD = env.USER_PASSWORD;

  return {
    STRIPE_WEBHOOK_SECRET,
    FIREBASE_API_KEY,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_APP_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_EMULATOR_HOST,
    FIREBASE_AUTH_EMULATOR_PORT,
    USER_EMAIL,
    USER_PASSWORD,
  };
}
