import { Trans } from 'react-i18next';
import type { ActionArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import { z } from 'zod';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';

import getLoggedInUser from '~/core/firebase/admin/auth/get-logged-in-user';
import inviteMembers from '~/lib/server/organizations/invite-members';

import InviteMembersForm from '~/components/organizations/InviteMembersForm';
import SettingsTile from '~/components/settings/SettingsTile';

import Button from '~/core/ui/Button';
import MembershipRole from '~/lib/organizations/types/membership-role';
import withCsrf from '~/core/middleware/with-csrf';
import withMethodsGuard from '~/core/middleware/with-methods-guard';
import { parseSessionIdCookie } from '~/lib/server/cookies/session.cookie';
import { parseOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';

export const meta: MetaFunction = () => {
  return {
    title: 'Invite Members',
  };
};

export async function action(props: ActionArgs) {
  const req = props.request;

  await withCsrf(req);
  await withMethodsGuard(req, ['POST']);

  const session = await parseSessionIdCookie(req);
  const organizationId = await parseOrganizationIdCookie(req);
  const user = await getLoggedInUser(session);

  const json = await req.json();
  const result = await getInviteMembersBodySchema().safeParseAsync(json);

  if (!result.success) {
    return throwBadRequestException();
  }

  const params = {
    invites: result.data,
    organizationId,
    inviterId: user.uid,
  };

  try {
    await inviteMembers(params);

    return redirect('/settings/organization/members');
  } catch (e) {
    return throwInternalServerErrorException();
  }
}

const OrganizationMembersInvitePage = () => {
  return (
    <>
      <SettingsTile
        heading={<Trans i18nKey={'organization:inviteMembersPageHeading'} />}
        subHeading={
          <Trans i18nKey={'organization:inviteMembersPageSubheading'} />
        }
      >
        <InviteMembersForm />
      </SettingsTile>

      <div className={'mt-4'}>
        <GoBackToMembersButton />
      </div>
    </>
  );
};

export default OrganizationMembersInvitePage;

function GoBackToMembersButton() {
  return (
    <Button
      size={'small'}
      color={'transparent'}
      href={'/settings/organization/members'}
    >
      <span className={'flex items-center space-x-1'}>
        <ArrowLeftIcon className={'h-3'} />

        <span>
          <Trans i18nKey={'organization:goBackToMembersPage'} />
        </span>
      </span>
    </Button>
  );
}

function getInviteMembersBodySchema() {
  return z.array(
    z.object({
      role: z.nativeEnum(MembershipRole),
      email: z.string().email(),
    })
  );
}
