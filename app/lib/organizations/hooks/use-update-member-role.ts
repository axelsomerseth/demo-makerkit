import useApiRequest from '~/core/hooks/use-api';
import type MembershipRole from '../types/membership-role';

function useUpdateMemberRequest(memberId: string) {
  return useApiRequest<void, { role: MembershipRole }>(
    `/settings/organization/members/${memberId}`,
    'PUT'
  );
}

export default useUpdateMemberRequest;
