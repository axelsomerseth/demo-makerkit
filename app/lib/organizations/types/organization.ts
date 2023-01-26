import type { FirestoreOrganizationMembership } from './organization-membership';
import type { OrganizationSubscription } from './organization-subscription';

type UserId = string;

interface BaseOrganization {
  name: string;
  timezone?: string;
  logoURL?: string | null;
  subscription?: OrganizationSubscription;
  customerId?: string;
}

export default interface Organization extends BaseOrganization {
  members: Record<UserId, FirestoreOrganizationMembership>;
}
