import type { Dispatch } from 'react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AuthProvider, useAuth, useFirebaseApp } from 'reactfire';

import type { User } from 'firebase/auth';

import {
  initializeAuth,
  indexedDBLocalPersistence,
  connectAuthEmulator,
  inMemoryPersistence,
} from 'firebase/auth';

import isBrowser from '~/core/generic/is-browser';
import useDestroySession from '~/core/hooks/use-destroy-session';
import type UserSession from '~/core/session/types/user-session';

export const FirebaseAuthStateListener: React.FCC<{
  onAuthStateChange: (user: User | null) => void | Promise<void>;
}> = ({ children, onAuthStateChange }) => {
  const auth = useAuth();

  // {@link onIdTokenChanged} will call the
  // callback when the user ID token changes
  // for example, when the user signs out
  // we update user context when ID token changes
  useEffect(() => {
    const subscription = auth.onIdTokenChanged(onAuthStateChange);

    return () => subscription();
  }, [auth, onAuthStateChange]);

  return <>{children}</>;
};

export default function FirebaseAuthProvider({
  userSession,
  setUserSession,
  children,
  useEmulator,
}: React.PropsWithChildren<{
  useEmulator: boolean;
  userSession: Maybe<UserSession>;
  setUserSession: Dispatch<Maybe<UserSession>>;
}>) {
  const app = useFirebaseApp();
  const signOut = useDestroySession();
  const userRef = useRef<Maybe<User>>();

  // make sure we're not using IndexedDB when SSR
  // as it is only supported on browser environments
  const persistence = useMemo(() => {
    return isBrowser() ? indexedDBLocalPersistence : inMemoryPersistence;
  }, []);

  const sdk = useMemo(
    () => initializeAuth(app, { persistence }),
    [app, persistence]
  );
  const shouldConnectEmulator = useEmulator && !('emulator' in sdk.config);

  const onAuthStateChanged = useCallback(
    async (user: User | null) => {
      if (user) {
        const session: UserSession = {
          auth: {
            ...user,
            customClaims: {},
            disabled: userSession?.auth?.disabled ?? false,
            multiFactor: userSession?.auth?.multiFactor ?? [],
          },
          data: userSession?.data,
        };

        userRef.current = user;

        return setUserSession(session);
      }

      // if the user is no longer defined and user was originally signed-in
      // (because userSession?.auth is defined) then we need to clear the
      // session cookie
      if (userRef.current) {
        try {
          // we need to delete the session cookie used for SSR
          signOut();
        } finally {
          setUserSession(undefined);
          userRef.current = undefined;
        }
      }
    },
    [
      setUserSession,
      signOut,
      userSession?.auth?.disabled,
      userSession?.auth?.multiFactor,
      userSession?.data,
    ]
  );

  useEffect(() => {
    if (shouldConnectEmulator) {
      const host = getAuthEmulatorHost();

      connectAuthEmulator(sdk, host);
    }
  }, [sdk, shouldConnectEmulator]);

  return (
    <AuthProvider sdk={sdk}>
      <FirebaseAuthStateListener onAuthStateChange={onAuthStateChanged}>
        {children}
      </FirebaseAuthStateListener>
    </AuthProvider>
  );
}

function getAuthEmulatorHost() {
  const host = 'localhost';
  const port = 9099;

  return ['http://', host, ':', port].join('');
}
