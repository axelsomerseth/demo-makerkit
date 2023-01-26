import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { z } from 'zod';
import { join } from 'path';

import getLogger from '~/core/logger';
import HttpStatusCode from '~/core/generic/http-status-code.enum';
import getApiRefererPath from '~/core/generic/get-api-referer-path';
import getLoggedInUser from '~/core/firebase/admin/auth/get-logged-in-user';
import withCsrf from '~/core/middleware/with-csrf';

import createStripeCheckout from '~/lib/stripe/create-checkout';
import { canChangeBilling } from '~/lib/organizations/permissions';
import { getUserRoleByOrganization } from '~/lib/server/organizations/memberships.server';
import { parseOrganizationIdCookie } from '~/lib/server/cookies/organization.cookie';
import { parseSessionIdCookie } from '~/lib/server/cookies/session.cookie';

export async function action(props: ActionArgs) {
  const req = props.request;
  const data = await req.formData();
  const body = Object.fromEntries(data.entries());
  const bodyResult = await getBodySchema().safeParseAsync(body);

  const redirectToErrorPage = () => {
    const referer = getApiRefererPath(req.headers);
    const url = join(referer, `?error=true`);

    return redirect(url);
  };

  if (!bodyResult.success) {
    return redirectToErrorPage();
  }

  await withCsrf(req, bodyResult.data.csrfToken);

  const sessionId = await parseSessionIdCookie(req);
  const user = await getLoggedInUser(sessionId);
  const userId = user.uid;
  const currentOrganizationId = await parseOrganizationIdCookie(req);

  if (!bodyResult.success) {
    return redirectToErrorPage();
  }

  const { organizationId, priceId, customerId, returnUrl } = bodyResult.data;
  const matchesSessionOrganizationId = currentOrganizationId === organizationId;

  if (!matchesSessionOrganizationId) {
    return redirectToErrorPage();
  }

  // check the user's role has access to the checkout
  const canChangeBilling = await getUserCanAccessCheckout({
    organizationId,
    userId,
  });

  // disallow if the user doesn't have permissions to change
  // billing settings based on its role. To change the logic, please update
  // {@link canChangeBilling}
  if (!canChangeBilling) {
    getLogger().debug(
      {
        userId,
        organizationId,
      },
      `User attempted to access checkout but lacked permissions`
    );

    return redirectToErrorPage();
  }

  try {
    const { url } = await createStripeCheckout({
      returnUrl,
      organizationId,
      priceId,
      customerId,
    });

    const portalUrl = getCheckoutPortalUrl(url, returnUrl);

    // redirect user back based on the response
    return redirect(portalUrl, {
      status: HttpStatusCode.SeeOther,
    });
  } catch (e) {
    getLogger().error(e, `Stripe Checkout error`);

    return redirectToErrorPage();
  }
}

async function getUserCanAccessCheckout(params: {
  organizationId: string;
  userId: string;
}) {
  try {
    const userRole = await getUserRoleByOrganization(params);

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
    csrfToken: z.string().min(1),
    organizationId: z.string().min(1),
    priceId: z.string().min(1),
    customerId: z.string().optional(),
    returnUrl: z.string().min(1),
  });
}

/**
 *
 * @param portalUrl
 * @param returnUrl
 * @description return the URL of the Checkout Portal
 * if running in emulator mode and the portal URL is undefined (as
 * stripe-mock does) then return the returnUrl (i.e. it redirects back to
 * the subscriptions page)
 */
function getCheckoutPortalUrl(portalUrl: string | null, returnUrl: string) {
  if (isTestingMode() && !portalUrl) {
    return [returnUrl, 'success=true'].join('?');
  }

  return portalUrl as string;
}

/**
 * @description detect if Stripe is running in emulator mode
 */
function isTestingMode() {
  const enableStripeTesting = process.env.ENABLE_STRIPE_TESTING;

  return enableStripeTesting === 'true';
}
