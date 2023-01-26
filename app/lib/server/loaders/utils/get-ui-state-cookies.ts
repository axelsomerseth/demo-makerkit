import { parseSidebarStateCookie } from '~/lib/server/cookies/sidebar-state.cookie';
import { parseThemeCookie } from '~/lib/server/cookies/theme.cookie';

async function getUIStateCookies(request: Request) {
  const [theme, sidebarState] = await Promise.all([
    parseThemeCookie(request),
    parseSidebarStateCookie(request),
  ]);

  return {
    theme,
    sidebarState,
  };
}

export default getUIStateCookies;
