import { createContext } from 'react';
import type Organization from '~/lib/organizations/types/organization';

const OrganizationContext = createContext<{
  organization: Maybe<WithId<Organization>>;
  setOrganization: (user: WithId<Organization>) => void;
}>({
  organization: undefined,
  setOrganization: (_) => _,
});

export default OrganizationContext;
