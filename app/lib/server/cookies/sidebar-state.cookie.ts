import getCookieHeader from '~/core/generic/get-cookie-header';

const SIDEBAR_STATE_COOKIE_NAME = 'sidebarState';

export async function parseSidebarStateCookie(request: Request) {
  const cookie = await getSidebarCookie();
  return cookie.parse(getCookieHeader(request));
}

export async function getSidebarCookie() {
  const { createCookie } = await import('@remix-run/node');

  return createCookie(SIDEBAR_STATE_COOKIE_NAME, {
    path: '/',
    httpOnly: false,
    secure: process.env.EMULATOR !== `true`,
    sameSite: 'strict' as const,
  });
}
