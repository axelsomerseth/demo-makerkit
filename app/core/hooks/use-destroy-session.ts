import { useFetcher } from '@remix-run/react';
import { useCallback } from 'react';

function useDestroySession() {
  const fetcher = useFetcher();

  return useCallback(() => {
    fetcher.submit(
      {},
      {
        method: 'post',
        action: '/auth/sign-out',
      }
    );

    return fetcher;
  }, [fetcher]);
}

export default useDestroySession;
