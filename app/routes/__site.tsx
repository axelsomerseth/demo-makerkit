import { Outlet } from '@remix-run/react';
import { useState } from 'react';

import firebaseConfig from '../firebase.config';
import FirebaseAppShell from '~/core/firebase/components/FirebaseAppShell';
import FirebaseAuthProvider from '~/core/firebase/components/FirebaseAuthProvider';
import UserSessionContext from '~/core/session/contexts/user-session';
import FirebaseAnalyticsProvider from '~/core/firebase/components/FirebaseAnalyticsProvider';
import type UserSession from '~/core/session/types/user-session';
import SiteHeader from '~/components/SiteHeader';

function SiteLayout() {
  const [userSession, setUserSession] = useState<UserSession>();

  return (
    <FirebaseAppShell config={firebaseConfig}>
      <FirebaseAuthProvider
        useEmulator={firebaseConfig.emulator}
        userSession={userSession}
        setUserSession={setUserSession}
      >
        <FirebaseAnalyticsProvider>
          <UserSessionContext.Provider value={{ userSession, setUserSession }}>
            <SiteHeader />
            <Outlet />
          </UserSessionContext.Provider>
        </FirebaseAnalyticsProvider>
      </FirebaseAuthProvider>
    </FirebaseAppShell>
  );
}

export default SiteLayout;
