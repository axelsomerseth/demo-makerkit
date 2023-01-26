declare global {
  type StringObject = Record<string, string>;
  type NumberObject = Record<string, number>;
  type UnknownObject = Record<string, unknown>;
  type BooleanObject = Record<string, boolean>;
  type UnixTimestamp = number;

  type WithId<T> = T & {
    id: string;
  };

  type Truthy<T> = false extends T
    ? never
    : 0 extends T
    ? never
    : '' extends T
    ? never
    : null extends T
    ? never
    : undefined extends T
    ? never
    : T;

  type Falsy = false | 0 | '' | null | undefined;
  type Maybe<T> = T | undefined;

  type EmptyCallback = () => void;

  type HttpMethod = `GET` | `POST` | `PUT` | 'PATCH' | 'DELETE' | 'HEAD';

  namespace Cypress {
    interface Chainable {
      cyGet(name: string): Chainable<JQuery>;

      signIn(
        redirectPath?: string,
        credentials?: { email: string; password: string }
      ): void;

      clearStorage(): void;

      signOutSession(): void;
    }
  }

  interface Window {
    ENV: {
      FIREBASE_API_KEY: string;
      FIREBASE_AUTH_DOMAIN: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_STORAGE_BUCKET: string;
      FIREBASE_MESSAGING_SENDER_ID: string;
      FIREBASE_APP_ID: string;
      FIREBASE_MEASUREMENT_ID: string;
      EMULATOR: string;
      EMULATOR_HOST: string;
      ENVIRONMENT: string;
      FIREBASE_EMULATOR_HOST: string;
      FIRESTORE_EMULATOR_PORT: number;
      DEFAULT_LOCALE: string;
      SITE_URL: string;
      APPCHECK_KEY: string;
      SENTRY_DSN: string;
      NODE_ENV: string;
    };
  }
}

declare module 'react' {
  type FCC<Props = Record<string, unknown>> = React.FC<
    React.PropsWithChildren<Props>
  >;
}

export {};
