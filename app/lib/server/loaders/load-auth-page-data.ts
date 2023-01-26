import type { LoaderArgs } from '@remix-run/server-runtime';
import { json, redirect } from '@remix-run/node';

import getLoggedInUser from '~/core/firebase/admin/auth/get-logged-in-user';
import createCsrfToken from '~/core/generic/create-csrf-token';
import { serializeCsrfSecretCookie } from '~/lib/server/cookies/csrf-secret.cookie';
import { parseSessionIdCookie } from '~/lib/server/cookies/session.cookie';

import configuration from '~/configuration';

const loadAuthPageData = async ({ request }: LoaderArgs) => {
  const session = await parseSessionIdCookie(request);
  const { headers, token } = await getCsrfTokenHeaders();

  const ok = () => {
    return json(
      {
        csrfToken: token,
      },
      {
        headers,
      }
    );
  };

  try {
    const user = await getLoggedInUser(session);

    if (user) {
      return redirect(configuration.paths.appHome);
    }

    return ok();
  } catch (e) {
    return ok();
  }
};

async function getCsrfTokenHeaders() {
  const headers = new Headers();
  const { secret, token } = await createCsrfToken();

  headers.append('Set-Cookie', await serializeCsrfSecretCookie(secret));

  return {
    headers,
    token,
  };
}

export default loadAuthPageData;
