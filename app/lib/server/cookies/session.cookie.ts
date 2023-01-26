import { getSessionCookieTTL } from '~/lib/server/auth/save-session-cookie';
import getCookieHeader from '~/core/generic/get-cookie-header';
import getLogger from '~/core/logger';

const SESSION_COOKIE_NAME = `session`;

export function getSessionIdCookie() {
  return createSessionCookie(SESSION_COOKIE_NAME);
}

export async function deleteSessionIdCookie() {
  const cookie = await getSessionIdCookie();
  return cookie.serialize('', { maxAge: -1 });
}

export async function serializeSessionIdCookie(sessionId: string) {
  const cookie = await getSessionIdCookie();
  return cookie.serialize(sessionId);
}

export async function parseSessionIdCookie(request: Request) {
  const cookie = await getSessionIdCookie();
  return cookie.parse(getCookieHeader(request));
}

async function createSessionCookie(cookieName: string) {
  const { createCookie } = await import('@remix-run/node');

  // only save cookie with secure flag if we're not in dev mode
  const secure = shouldUseSecureCookies();
  const secret = process.env.SECRET_KEY;
  const secrets = secret ? [secret] : [];

  if (!secrets.length) {
    getLogger().warn(
      `Please set your "SECRET_KEY" environment variable to sign your cookies`
    );
  }

  const options = {
    maxAge: getSessionCookieTTL(),
    httpOnly: true,
    secure,
    path: '/',
    sameSite: 'lax' as const,
    secrets,
  };

  // when the session-cookie gets created
  // we store it as an httpOnly cookie (important!)
  return createCookie(cookieName, options);
}

/**
 * @name shouldUseSecureCookies
 * @description Only save cookie with secure flag if we're not in dev mode
 */
function shouldUseSecureCookies() {
  return process.env.EMULATOR !== 'true';
}
