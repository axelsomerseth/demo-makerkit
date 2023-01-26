import { lazy, useEffect, useRef } from 'react';
import type { LoaderArgs } from '@remix-run/server-runtime';
import type { MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { Trans } from 'react-i18next';

import SettingsTile from '~/components/settings/SettingsTile';

import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import ClientOnly from '~/core/ui/ClientOnly';

import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';
import useUserCanInviteUsers from '~/lib/organizations/hooks/use-user-can-invite-users';
import { getOrganizationMembers } from '~/lib/server/organizations/memberships.server';

import getLoggedInUser from '~/core/firebase/admin/auth/get-logged-in-user';
import initializeFirebaseAdminApp from '~/core/firebase/admin/initialize-firebase-admin-app';
import { parseSessionIdCookie } from '~/lib/server/cookies/session.cookie';
import { parseOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';

import configuration from '~/configuration';

const OrganizationMembersList = lazy(
  () => import('~/components/organizations/OrganizationMembersList')
);

const OrganizationInvitedMembersList = lazy(
  () => import('~/components/organizations/OrganizationInvitedMembersList')
);

export const meta: MetaFunction = () => {
  return {
    title: 'Members',
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  await initializeFirebaseAdminApp();

  const organizationId = await parseOrganizationIdCookie(request);

  if (!organizationId) {
    return redirect(configuration.paths.appHome);
  }

  const session = await parseSessionIdCookie(request);
  const user = await getLoggedInUser(session);

  const members = await getOrganizationMembers({
    organizationId,
    userId: user.uid,
  });

  return json(members);
};

const OrganizationMembersPage = () => {
  const members = useLoaderData<typeof loader>();
  const canInviteUsers = useUserCanInviteUsers();
  const organization = useCurrentOrganization();
  const organizationId = organization?.id;

  useReloadMembersOnOrganizationChanged();

  if (!organizationId) {
    return null;
  }

  return (
    <>
      <div className={'my-4 flex justify-end'}>
        <If condition={canInviteUsers}>
          <InviteMembersButton />
        </If>
      </div>

      <div className="flex flex-1 flex-col space-y-6">
        <SettingsTile
          heading={<Trans i18nKey={'organization:membersTabLabel'} />}
          subHeading={<Trans i18nKey={'organization:membersTabSubheading'} />}
        >
          <ClientOnly>
            <OrganizationMembersList
              membersMetadata={members}
              organizationId={organizationId}
            />
          </ClientOnly>
        </SettingsTile>

        <SettingsTile
          heading={<Trans i18nKey={'organization:pendingInvitesHeading'} />}
          subHeading={
            <Trans i18nKey={'organization:pendingInvitesSubheading'} />
          }
        >
          <ClientOnly>
            <OrganizationInvitedMembersList organizationId={organizationId} />
          </ClientOnly>
        </SettingsTile>
      </div>
    </>
  );
};

export default OrganizationMembersPage;

function useReloadMembersOnOrganizationChanged() {
  const navigate = useNavigate();
  const organization = useCurrentOrganization();
  const organizationId = organization?.id;
  const oldOrganizationId = useRef(organizationId);

  useEffect(() => {
    if (organizationId !== oldOrganizationId.current) {
      void navigate('.', { replace: true });
    }
  }, [navigate, organizationId]);
}

function InviteMembersButton() {
  return (
    <Button
      className={'w-full lg:w-auto'}
      data-cy={'invite-form-link'}
      type="button"
      href={'/settings/organization/members/invite'}
    >
      <span className="flex items-center space-x-2">
        <UserPlusIcon className="h-5" />

        <span>
          <Trans i18nKey={'organization:inviteMembersButtonLabel'} />
        </span>
      </span>
    </Button>
  );
}
