import { useCallback, useContext } from 'react';
import { AppCheckSdkContext } from 'reactfire';

import useGetCsrfToken from '~/core/firebase/hooks/use-get-csrf-token';

function useGetSecurityHeaders() {
  const getAppCheckToken = useGetAppCheckToken();
  const getCsrfToken = useGetCsrfToken();

  return useCallback(async () => {
    const appCheckToken = await getAppCheckToken();
    const csrfToken = getCsrfToken();

    return {
      appCheckToken,
      csrfToken,
    };
  }, [getAppCheckToken, getCsrfToken]);
}

function useGetAppCheckToken() {
  // instead of using useAppCheck()
  // we manually request the SDK
  // because we *may not have initialized it*
  const sdk = useContext(AppCheckSdkContext);

  return useCallback(async () => {
    try {
      // if the SDK does not exist, we cannot generate a token
      if (!sdk) {
        return;
      }

      const forceRefresh = false;
      const { getToken } = await import('firebase/app-check');
      const { token } = await getToken(sdk, forceRefresh);

      return token;
    } catch (e) {
      return;
    }
  }, [sdk]);
}

export default useGetSecurityHeaders;
