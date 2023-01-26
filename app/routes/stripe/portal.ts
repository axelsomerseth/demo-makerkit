import { z } from 'zod';
import { join } from 'path';
import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import configuration from '~/configuration';

import getApiRefererPath from '~/core/generic/get-api-referer-path';
import HttpStatusCode from '~/core/generic/http-status-code.enum';

import { canChangeBilling } from '~/lib/organizations/permissions';
import { getUserRoleByOrganization } from '~/lib/server/organizations/memberships.server';
import { getOrganizationByCustomerId } from '~/lib/server/organizations/subscriptions';
import { parseSessionIdCookie } from '~/lib/server/cookies/session.cookie';
import createBillingPortalSession from '~/lib/stripe/create-billing-portal-session';

import getLoggedInUser from '~/core/firebase/admin/auth/get-logged-in-user';
import withCsrf from '~/core/middleware/with-csrf';
import getLogger from '~/core/logger';

export async function action(props: ActionArgs) {
  const req = props.request;
  const data = await req.formData();
  const body = Object.fromEntries(data.entries());
  const bodyResult = await getBodySchema().safeParseAsync(body);
  const referrerPath = getApiRefererPath(req.headers);

  if (!bodyResult.success) {
    return redirectToErrorPage(referrerPath);
  }

  const { customerId, csrfToken } = bodyResult.data;

  await withCsrf(req, csrfToken);

  const logger = getLogger();
  const session = await parseSessionIdCookie(req);
  const user = await getLoggedInUser(session);
  const userId = user.uid;

  // we check that the user is authorized to access the portal
  const canAccess = await getUserCanAccessCustomerPortal({
    customerId,
    userId,
  });

  if (!canAccess) {
    return redirectToErrorPage(referrerPath);
  }

  try {
    const referer = req.headers.get('referer');
    const origin = req.headers.get('origin');
    const returnUrl = referer || origin || configuration.paths.appHome;

    const { url } = await createBillingPortalSession({
      returnUrl,
      customerId,
    });

    return redirect(url, {
      status: HttpStatusCode.SeeOther,
    });
  } catch (error) {
    logger.error(error, `Stripe Billing Portal redirect error`);

    return redirectToErrorPage(referrerPath);
  }
}

/**
 * @name getUserCanAccessCustomerPortal
 * @description Returns whether a user {@link userId} has access to the
 * Stripe portal of an organization with customer ID {@link customerId}
 */
async function getUserCanAccessCustomerPortal(params: {
  customerId: string;
  userId: string;
}) {
  try {
    const organization = await getOrganizationByCustomerId(params.customerId);

    const userRole = await getUserRoleByOrganization({
      organizationId: organization.id,
      userId: params.userId,
    });

    if (userRole === undefined) {
      return false;
    }

    return canChangeBilling(userRole);
  } catch (e) {
    getLogger().error(e, `Could not retrieve user role`);

    return false;
  }
}

function getBodySchema() {
  return z.object({
    customerId: z.string(),
    csrfToken: z.string(),
  });
}

function redirectToErrorPage(referrerPath: string) {
  const url = join(referrerPath, `?error=true`);

  return redirect(url);
}
