import useApiRequest from '~/core/hooks/use-api';
import type MembershipRole from '../types/membership-role';

interface Invite {
  email: string;
  role: MembershipRole;
}

export function useInviteMembers() {
  return useApiRequest<void, Invite[]>(
    `/settings/organization/members/invite`,
    'POST',
    {
      redirect: 'follow',
    }
  );
}
