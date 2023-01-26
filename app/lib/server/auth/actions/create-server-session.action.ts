import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { z } from 'zod';

import withCsrf from '~/core/middleware/with-csrf';
import createServerSideSession from '~/core/firebase/admin/auth/create-server-side-session';
import { throwBadRequestException } from '~/core/http-exceptions';

import configuration from '~/configuration';
import withFirebaseAdmin from '~/core/middleware/with-firebase-admin';

const RETURN_URL_QUERY_PARAM = 'returnUrl';

const createServerSessionAction: ActionFunction = async ({
  request,
  params,
}) => {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData.entries());
  const result = await getFormDataSchema().safeParseAsync(fields);

  if (!result.success) {
    return throwBadRequestException();
  }

  await withCsrf(request, () => result.data.csrfToken);
  await withFirebaseAdmin();

  const session = await createServerSideSession(result.data.idToken);
  const headers = new Headers({
    'Set-Cookie': session,
  });

  const path = getReturnPath(request.url);
  const redirectUrl = path || configuration.paths.appHome;

  return redirect(redirectUrl, {
    headers,
  });
};

export default createServerSessionAction;

function getFormDataSchema() {
  return z.object({
    idToken: z.string().min(1),
    csrfToken: z.string().min(1),
  });
}

function getReturnPath(url: string) {
  return new URL(url).searchParams.get(RETURN_URL_QUERY_PARAM);
}
