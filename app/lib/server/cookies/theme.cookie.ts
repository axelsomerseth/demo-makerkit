import getCookieHeader from '~/core/generic/get-cookie-header';

const THEME_COOKIE_NAME = 'theme';

export async function parseThemeCookie(request: Request) {
  const cookie = await getThemeCookie();
  return cookie.parse(getCookieHeader(request));
}

async function getThemeCookie() {
  const { createCookie } = await import('@remix-run/node');

  return createCookie(THEME_COOKIE_NAME, {
    path: '/',
    httpOnly: false,
    secure: process.env.EMULATOR !== `true`,
    sameSite: 'lax' as const,
  });
}
