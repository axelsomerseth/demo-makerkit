import useApiRequest from '~/core/hooks/use-api';

function useRemoveMemberRequest(memberId: string) {
  const path = `/settings/organization/members/${memberId}`;

  return useApiRequest<void>(path, `DELETE`);
}

export default useRemoveMemberRequest;
