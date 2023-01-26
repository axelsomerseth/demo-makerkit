import { useCallback } from 'react';
import { useFetcher } from '@remix-run/react';

/**
 * @name useFetchOrganizationMembersMetadata
 * @param organizationId
 */
export default function useFetchOrganizationMembersMetadata(
  organizationId: string
) {
  const fetcher = useFetcher();
  const path = getFetchMembersPath(organizationId);

  return useCallback(() => {
    return fetcher.submit(
      {},
      {
        method: 'get',
        action: path,
      }
    );
  }, [fetcher, path]);
}

function getFetchMembersPath(organizationId: string) {
  return `/api/organizations/${organizationId}/members`;
}
