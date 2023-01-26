import getCookieHeader from '~/core/generic/get-cookie-header';

const ORGANIZATION_ID_COOKIE_NAME = 'organizationId';

export async function getOrganizationCookie() {
  const { createCookie } = await import('@remix-run/node');
  const secure = process.env.EMULATOR !== 'true';

  return createCookie(ORGANIZATION_ID_COOKIE_NAME, {
    httpOnly: false,
    secure,
    path: '/',
    sameSite: 'lax' as const,
  });
}

export async function parseOrganizationIdCookie(request: Request) {
  const cookie = await getOrganizationCookie();

  return cookie.parse(getCookieHeader(request));
}

export async function serializeOrganizationIdCookie(organizationId: string) {
  const cookie = await getOrganizationCookie();

  return cookie.serialize(organizationId);
}
