import {
  createFirebaseSessionCookie,
  getSessionCookieTTL,
} from '~/lib/server/auth/save-session-cookie';

import { serializeSessionIdCookie } from '~/lib/server/cookies/session.cookie';

async function createServerSideSession(idToken: string) {
  const expiresIn = getSessionCookieTTL();

  const sessionCookie = await createFirebaseSessionCookie(idToken, expiresIn);

  return serializeSessionIdCookie(sessionCookie);
}

export default createServerSideSession;
