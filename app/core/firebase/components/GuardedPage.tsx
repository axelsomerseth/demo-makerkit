import { useCallback, useEffect } from 'react';
import { useAuth, useSigninCheck } from 'reactfire';

import isBrowser from '~/core/generic/is-browser';
import useClearFirestoreCache from '~/core/hooks/use-clear-firestore-cache';

const AuthRedirectListener: React.FCC<{
  whenSignedOut?: string;
}> = ({ children, whenSignedOut }) => {
  const auth = useAuth();
  const { status } = useSigninCheck();
  const redirectUserAway = useRedirectUserAway();
  const clearCache = useClearFirestoreCache();
  const isSignInCheckDone = status === 'success';

  useEffect(() => {
    // this should run once and only on success
    if (!isSignInCheckDone) {
      return;
    }

    // keep this running for the whole session
    // unless the component was unmounted, for example, on log-outs
    const listener = auth.onAuthStateChanged((user) => {
      // log user out if user is falsy
      // and if the consumer provided a route to redirect the user
      const shouldLogOut = !user && whenSignedOut;

      if (!user) {
        clearCache();
      }

      if (shouldLogOut) {
        return redirectUserAway(whenSignedOut);
      }
    });

    // destroy listener on un-mounts
    return () => listener();
  }, [
    auth,
    clearCache,
    isSignInCheckDone,
    redirectUserAway,
    status,
    whenSignedOut,
  ]);

  return <>{children}</>;
};

export default function GuardedPage({
  children,
  whenSignedOut,
}: React.PropsWithChildren<{
  whenSignedOut?: string;
}>) {
  const shouldActivateListener = isBrowser();

  // we only activate the listener if
  // we are rendering in the browser
  if (!shouldActivateListener) {
    return <>{children}</>;
  }

  return (
    <AuthRedirectListener whenSignedOut={whenSignedOut}>
      {children}
    </AuthRedirectListener>
  );
}

function useRedirectUserAway() {
  return useCallback((path: string) => {
    const currentPath = window.location.pathname;
    const isNotCurrentPage = currentPath !== path;

    // we then redirect the user to the page
    // specified in the props of the component
    if (isNotCurrentPage) {
      window.location.assign(path);
    }
  }, []);
}
