import getCookieHeader from '~/core/generic/get-cookie-header';
import getLogger from '~/core/logger';

const CSRF_SECRET_COOKIE_NAME = 'csrfSecret';

async function getCsrfSecretCookie() {
  const { createCookie } = await import('@remix-run/node');

  const secret = process.env.SECRET_KEY;
  const secrets = secret ? [secret] : [];

  if (!secrets.length) {
    getLogger().warn(
      `Please set your "SECRET_KEY" environment variable to sign your cookies`
    );
  }

  return createCookie(CSRF_SECRET_COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    secure: process.env.EMULATOR !== `true`,
    sameSite: 'strict' as const,
    secrets,
  });
}

export async function parseCsrfSecretCookie(request: Request) {
  const cookie = await getCsrfSecretCookie();
  return cookie.parse(getCookieHeader(request));
}

export async function serializeCsrfSecretCookie(csrfSecret: string) {
  const cookie = await getCsrfSecretCookie();
  return cookie.serialize(csrfSecret);
}

export async function deleteCsrfSecretCookie() {
  const cookie = await getCsrfSecretCookie();
  return cookie.serialize('', { maxAge: -1 });
}
