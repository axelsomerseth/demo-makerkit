import { useCallback, useContext, useRef } from 'react';
import { AppCheckSdkContext } from 'reactfire';

import useRequestState from '~/core/hooks/use-request-state';
import useGetCsrfToken from '~/core/firebase/hooks/use-get-csrf-token';

const FIREBASE_APP_CHECK_HEADER = 'X-Firebase-AppCheck';
const CSRF_TOKEN_HEADER = 'x-csrf-token';

/**
 * @name useApiRequest
 * @param path
 * @param method
 * @param config
 */
export default function useApiRequest<Resp = unknown, Body = void>(
  path: string,
  method: HttpMethod = 'POST',
  config?: Partial<{
    headers: StringObject;
    redirect: RequestRedirect;
  }>
) {
  const { setError, setLoading, setData, state } = useRequestState<
    Resp,
    string
  >();

  const headersRef = useRef(config?.headers);
  const getAppCheckToken = useGetAppCheckToken();
  const getCsrfToken = useGetCsrfToken();

  const fn = useCallback(
    async (body: Body) => {
      setLoading(true);

      try {
        const payload = JSON.stringify(body);
        const appCheckToken = await getAppCheckToken();
        const csrfToken = getCsrfToken();

        if (!headersRef.current) {
          headersRef.current = {};
        }

        // if the app-check token was found
        // we add the header to the API request
        if (appCheckToken) {
          headersRef.current[FIREBASE_APP_CHECK_HEADER] = appCheckToken;
        }

        if (csrfToken) {
          headersRef.current[CSRF_TOKEN_HEADER] = csrfToken;
        }

        const data = await executeFetchRequest<Resp>({
          url: path,
          payload,
          method,
          headers: headersRef.current,
        });

        setData(data);

        return Promise.resolve(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : `Unknown error`;

        setError(message);

        return Promise.reject(error);
      }
    },
    [
      setLoading,
      getAppCheckToken,
      getCsrfToken,
      path,
      method,
      setData,
      setError,
    ]
  );

  return [fn, state] as [typeof fn, typeof state];
}

async function executeFetchRequest<Resp = unknown>(params: {
  url: string;
  payload: string;
  method: string;
  redirect?: RequestRedirect;
  headers?: StringObject;
}) {
  const { url, method, payload, redirect, headers } = params;

  const options: RequestInit = {
    method,
    redirect,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
  };

  const methodsSupportingBody: HttpMethod[] = ['POST', 'PUT', 'DELETE'];
  const supportsBody = methodsSupportingBody.includes(method as HttpMethod);

  if (payload && supportsBody) {
    options.body = payload;
  }

  try {
    const response = await fetch(url, options);

    if (response.redirected) {
      window.location.href = response.url;

      return Promise.resolve() as Promise<Resp>;
    }

    if (response.ok) {
      return (await response.json()) as Promise<Resp>;
    }

    return Promise.reject(response.statusText);
  } catch (e) {
    return Promise.reject(e);
  }
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
