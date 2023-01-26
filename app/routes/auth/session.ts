import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { z } from 'zod';

import withCsrf from '~/core/middleware/with-csrf';
import createServerSideSession from '~/core/firebase/admin/auth/create-server-side-session';
import { throwBadRequestException } from '~/core/http-exceptions';
import withFirebaseAdmin from '~/core/middleware/with-firebase-admin';

export const action: ActionFunction = async ({ request }) => {
  const payload = await request.json();
  const body = await getBodySchema().safeParseAsync(payload);

  if (!body.success) {
    return throwBadRequestException();
  }

  await withCsrf(request);
  await withFirebaseAdmin();

  const session = await createServerSideSession(body.data.idToken);
  const headers = new Headers();

  headers.append('Set-Cookie', session);

  return json({ success: true }, { headers });
};

function getBodySchema() {
  return z.object({
    idToken: z.string().min(1),
  });
}
