import { getAppCheck } from 'firebase-admin/app-check';
import { throwUnauthorizedException } from '~/core/http-exceptions';
import configuration from '~/configuration';

const FIREBASE_APPCHECK_HEADER = 'x-firebase-appcheck';

/**
 * @name withAppCheck
 * @description Protect an API endpoint with Firebase AppCheck.
 *
 *
 * Do not use if:
 * - AppCheck is not configured
 * - The request is not expected from users (for example, webhooks)
 *
 * Use if:
 * - You expect the requests to come from the application UI
 */
async function withAppCheck(request: Request) {
  if (!configuration.appCheckSiteKey) {
    return;
  }

  const token = request.headers.get(FIREBASE_APPCHECK_HEADER);

  if (!token) {
    return throwUnauthorizedException();
  }

  try {
    await getAppCheck().verifyToken(token);
  } catch (e) {
    return throwUnauthorizedException();
  }
}

export default withAppCheck;
