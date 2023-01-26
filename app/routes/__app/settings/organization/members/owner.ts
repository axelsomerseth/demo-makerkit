import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { z } from 'zod';
import type { UpdateData } from 'firebase-admin/firestore';

import { parseOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import { parseSessionIdCookie } from '~/lib/server/cookies/session.cookie';
import getLoggedInUser from '~/core/firebase/admin/auth/get-logged-in-user';

import { getOrganizationById } from '~/lib/server/queries';

import {
  throwForbiddenException,
  throwNotFoundException,
} from '~/core/http-exceptions';

import MembershipRole from '~/lib/organizations/types/membership-role';
import type Organization from '~/lib/organizations/types/organization';
import withCsrf from '~/core/middleware/with-csrf';
import withMethodsGuard from '~/core/middleware/with-methods-guard';
import getLogger from '~/core/logger';

export async function action(args: ActionArgs) {
  const req = args.request;

  await withCsrf(req);
  await withMethodsGuard(req, ['PUT']);

  const body = await req.json();
  const logger = getLogger();

  const organizationId = await parseOrganizationIdCookie(req);
  const sessionId = await parseSessionIdCookie(req);
  const user = await getLoggedInUser(sessionId);

  const { userId: targetUserId } = getBodySchema().parse(body);

  const currentUserId = user.uid;
  const organizationRef = await getOrganizationById(organizationId);
  const organization = organizationRef.data();

  logger.info(
    {
      organizationId,
      currentUserId,
      targetUserId,
    },
    `Transferring Ownership`
  );

  // we check that the organization exists
  if (!organizationRef.exists || !organization) {
    return throwNotFoundException(`Organization was not found`);
  }

  // now, we want to validate that:
  // 1. the members exist
  // 2. the member calling the action is the owner of the organization

  const members = organization.members;
  const currentUserMembership = members[currentUserId];
  const targetUserMembership = members[targetUserId];

  if (!targetUserMembership) {
    return throwNotFoundException(`Target member was not found`);
  }

  if (!currentUserMembership) {
    return throwNotFoundException(`Current member was not found`);
  }

  if (currentUserMembership.role !== MembershipRole.Owner) {
    return throwForbiddenException(`Current member is not the Owner`);
  }

  // validation finished! We should be good to go.

  // let's build the firestore update object to deeply update the nested
  // properties
  const updateData = {
    [`members.${currentUserId}.role`]: MembershipRole.Admin,
    [`members.${targetUserId}.role`]: MembershipRole.Owner,
  } as unknown as UpdateData<Organization>;

  // now we can swap the roles by updating the members' roles in the
  // organization's "members" object
  await organizationRef.ref.update(updateData);

  logger.info(
    {
      organizationId,
      currentUserId,
      targetUserId,
    },
    `Ownership successfully transferred to target user`
  );

  return json({ success: true });
}

function getBodySchema() {
  return z.object({
    userId: z.string().min(1),
  });
}
