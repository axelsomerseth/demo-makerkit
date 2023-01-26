import { Trans } from 'react-i18next';

import If from '~/core/ui/If';
import Badge from '~/core/ui/Badge';
import useUserId from '~/core/hooks/use-user-id';
import RoleBadge from './RoleBadge';
import ProfileAvatar from '../ProfileAvatar';
import Alert from '~/core/ui/Alert';

import { canUpdateUser } from '~/lib/organizations/permissions';
import type Organization from '~/lib/organizations/types/organization';
import useFetchOrganization from '~/lib/organizations/hooks/use-fetch-organization';

import LoadingMembersSpinner from '~/components/organizations/LoadingMembersSpinner';
import OrganizationMembersActionsContainer from './OrganizationMembersActionsContainer';
import type { SerializedUserAuthData } from '~/core/session/types/user-session';

function OrganizationMembersList({
  organizationId,
  membersMetadata,
}: React.PropsWithChildren<{
  organizationId: string;
  membersMetadata: SerializedUserAuthData[];
}>) {
  const userId = useUserId();

  // fetch the organization members with an active listener
  // and re-render on changes
  const {
    data: organization,
    status,
    error,
  } = useFetchOrganization(organizationId);

  const isLoading = status === 'loading';

  if (isLoading) {
    return (
      <LoadingMembersSpinner>
        <Trans i18nKey={'organization:loadingMembers'} />
      </LoadingMembersSpinner>
    );
  }

  if (error) {
    return (
      <Alert type={'error'}>
        <Trans i18nKey={'organization:loadMembersError'} />
      </Alert>
    );
  }

  const members = getSortedMembers(organization);
  const currentUser = members.find((member) => member.id === userId);

  if (!currentUser) {
    return null;
  }

  const userRole = currentUser.role;

  return (
    <div className={'w-full space-y-10'}>
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-black-400">
        {members.map(({ role, id: memberId }) => {
          const metadata = membersMetadata?.find((metadata) => {
            return metadata.uid === memberId;
          });

          if (!metadata) {
            return null;
          }

          const displayName = metadata.displayName
            ? metadata.displayName
            : metadata.email;

          const isCurrentUser = userId === metadata.uid;

          // check if user has the permissions to update another member of
          // the organization. If it returns false, the actions' dropdown
          // should be disabled
          const shouldEnableActions = canUpdateUser(userRole, role);
          const key = `${metadata.uid}:${userRole}`;

          return (
            <div
              key={key}
              data-cy={'organization-member'}
              className={
                'flex flex-col py-2 lg:flex-row lg:items-center lg:space-x-2' +
                ' justify-between space-y-2 lg:space-y-0'
              }
            >
              <div className={'flex flex-auto items-center space-x-4'}>
                <ProfileAvatar user={metadata} />

                <div className={'block truncate text-sm'}>{displayName}</div>

                <If condition={isCurrentUser}>
                  <Badge>
                    <Trans i18nKey={'organization:youBadgeLabel'} />
                  </Badge>
                </If>
              </div>

              <div className={'flex items-center justify-end space-x-4'}>
                <div>
                  <RoleBadge role={role} />
                </div>

                <OrganizationMembersActionsContainer
                  disabled={!shouldEnableActions}
                  targetMember={metadata}
                  targetMemberRole={role}
                  currentUserRole={userRole}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrganizationMembersList;

/**
 * @description Return the list of members sorted by role {@link MembershipRole}
 * @param organization
 */
function getSortedMembers(organization: WithId<Organization>) {
  const membersIds = Object.keys(organization.members);

  return membersIds
    .map((memberId) => {
      const member = organization.members[memberId];

      return {
        ...member,
        id: memberId,
      };
    })
    .sort((prev, next) => {
      return next.role > prev.role ? 1 : -1;
    });
}
