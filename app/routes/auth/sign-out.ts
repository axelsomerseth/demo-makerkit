import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import {
  parseSessionIdCookie,
  deleteSessionIdCookie,
} from '~/lib/server/cookies/session.cookie';

import { deleteCsrfSecretCookie } from '~/lib/server/cookies/csrf-secret.cookie';
import withFirebaseAdmin from '~/core/middleware/with-firebase-admin';
import getLogger from '~/core/logger';

export const action: ActionFunction = async ({ request }) => {
  await withFirebaseAdmin();

  // if the session cookie does not exist
  // we cannot delete nor sign the user out
  // so, we end the request
  const session = await parseSessionIdCookie(request);

  if (!session) {
    return signOutAndRedirect();
  }

  try {
    // revoke cookie with Firebase Auth
    await revokeFirebaseSessionToken(session);
  } catch (e) {
    getLogger().warn(e, `Could not destroy the user's session`);
  }

  return signOutAndRedirect();
};

async function revokeFirebaseSessionToken(sessionCookie: string) {
  const { getAuth } = await import('firebase-admin/auth');
  const auth = getAuth();
  const { sub } = await auth.verifySessionCookie(sessionCookie);

  return auth.revokeRefreshTokens(sub);
}

async function getNewHeaders() {
  const headers = new Headers();

  headers.append('Set-Cookie', await deleteSessionIdCookie());
  headers.append('Set-Cookie', await deleteCsrfSecretCookie());

  return headers;
}

async function signOutAndRedirect() {
  const headers = await getNewHeaders();

  return redirect('/', {
    headers,
  });
}
