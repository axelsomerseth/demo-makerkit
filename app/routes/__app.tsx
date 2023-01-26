import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';

import type UserSession from '~/core/session/types/user-session';
import type Organization from '~/lib/organizations/types/organization';
import loadAppData from '~/lib/server/loaders/load-app-data';

import FirebaseAppShell from '~/core/firebase/components/FirebaseAppShell';
import FirebaseAuthProvider from '~/core/firebase/components/FirebaseAuthProvider';
import FirebaseAnalyticsProvider from '~/core/firebase/components/FirebaseAnalyticsProvider';
import OrganizationContext from '~/lib/contexts/organization';
import UserSessionContext from '~/core/session/contexts/user-session';

import RouteShell from '~/components/RouteShell';
import firebaseConfig from '../firebase.config';

export const loader = loadAppData;

export const meta: MetaFunction = ({ data }) => {
  return {
    'csrf-token': data.csrfToken,
  };
};

function AppRoot() {
  const data = useLoaderData<typeof loadAppData>();

  const userSessionContext: UserSession = useMemo(() => {
    return {
      auth: data.session,
      data: data.user,
    };
  }, [data]);

  const [organization, setOrganization] = useState<Maybe<WithId<Organization>>>(
    data.organization || undefined
  );

  const [userSession, setUserSession] =
    useState<Maybe<UserSession>>(userSessionContext);

  const updateCurrentOrganization = useCallback(() => {
    setOrganization(data.organization ?? undefined);
  }, [data.organization]);

  const updateCurrentUser = useCallback(() => {
    if (userSessionContext.auth) {
      setUserSession(userSessionContext);
    }
  }, [userSessionContext]);

  useEffect(updateCurrentOrganization, [updateCurrentOrganization]);
  useEffect(updateCurrentUser, [updateCurrentUser]);

  const sidebarCollapsed = data?.ui?.sidebarState === 'collapsed';

  return (
    <FirebaseAppShell config={firebaseConfig}>
      <FirebaseAuthProvider
        useEmulator={firebaseConfig.emulator}
        userSession={userSession}
        setUserSession={setUserSession}
      >
        <FirebaseAnalyticsProvider>
          <UserSessionContext.Provider value={{ userSession, setUserSession }}>
            <OrganizationContext.Provider
              value={{ organization, setOrganization }}
            >
              <RouteShell sidebarCollapsed={sidebarCollapsed}>
                <Outlet />
              </RouteShell>
            </OrganizationContext.Provider>
          </UserSessionContext.Provider>
        </FirebaseAnalyticsProvider>
      </FirebaseAuthProvider>
    </FirebaseAppShell>
  );
}

export default AppRoot;
