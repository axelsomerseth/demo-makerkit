import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { z } from 'zod';

import withCsrf from '~/core/middleware/with-csrf';
import withMethodsGuard from '~/core/middleware/with-methods-guard';

import {
  throwBadRequestException,
  throwForbiddenException,
} from '~/core/http-exceptions';

import { parseOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import { parseSessionIdCookie } from '~/lib/server/cookies/session.cookie';

import {
  removeMemberFromOrganization,
  updateMemberRole,
} from '~/lib/server/organizations/memberships.server';
import getLoggedInUser from '~/core/firebase/admin/auth/get-logged-in-user';

import MembershipRole from '~/lib/organizations/types/membership-role';
import getLogger from '~/core/logger';

export async function action(args: ActionArgs) {
  const req = args.request;
  const targetUserId = args.params.member as string;

  await withCsrf(req);
  await withMethodsGuard(req, ['DELETE', 'PUT']);

  switch (req.method) {
    case 'PUT':
      return handleMemberRoleUpdate(req, targetUserId);

    case 'DELETE':
      return handleMemberRemovedFromOrganization(req, targetUserId);
  }
}

async function handleMemberRoleUpdate(req: Request, targetUserId: string) {
  const body = await req.json();
  const result = await getUpdateMemberBodySchema().safeParseAsync(body);

  if (!result.success) {
    return throwBadRequestException();
  }

  const logger = getLogger();
  const organizationId = await parseOrganizationIdCookie(req);
  const sessionId = await parseSessionIdCookie(req);
  const currentUser = await getLoggedInUser(sessionId);
  const currentUserId = currentUser.uid;

  const role = result.data.role;

  const payload = {
    organizationId,
    currentUserId,
    targetUserId,
  };

  if (payload.targetUserId === currentUserId) {
    logger.warn(`The current user cannot dispatch actions about itself`);

    return throwForbiddenException();
  }

  // update member role
  const updatePayload = { ...payload, role };
  await updateMemberRole(updatePayload);

  logger.info(updatePayload, `User role successfully updated`);

  return json({ success: true });
}

async function handleMemberRemovedFromOrganization(
  req: Request,
  targetUserId: string
) {
  const organizationId = await parseOrganizationIdCookie(req);
  const sessionId = await parseSessionIdCookie(req);
  const currentUser = await getLoggedInUser(sessionId);
  const currentUserId = currentUser.uid;

  const payload = {
    organizationId,
    currentUserId,
    targetUserId,
  };

  await removeMemberFromOrganization(payload);

  getLogger().info(payload, `User removed from organization`);

  return json({ success: true });
}

function getUpdateMemberBodySchema() {
  return z.object({
    role: z.nativeEnum(MembershipRole),
  });
}
