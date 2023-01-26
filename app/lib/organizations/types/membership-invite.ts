import type MembershipRole from './membership-role';

export default interface MembershipInvite {
  email: string;
  role: MembershipRole;
  code: string;
  expiresAt: number;

  organization: {
    id: string;
    name: string;
  };
}
