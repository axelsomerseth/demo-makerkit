/**
 * @name createFirebaseSessionCookie
 * @description Given an ID Token sent by the Client SDK, create and return
 * a session cookie using Firebase Auth. The session cookie gets stored and
 * will be used for authenticating users server-side for SSR and API functions.
 * @param idToken
 * @param expiresIn
 */
export async function createFirebaseSessionCookie(
  idToken: string,
  expiresIn: number
) {
  const { getAuth } = await import('firebase-admin/auth');
  const auth = getAuth();

  // create a session cookie using Firebase Auth by passing
  // to it the idToken returned by the client-side SDK
  return auth.createSessionCookie(idToken, {
    expiresIn,
  });
}

/**
 *
 * @param days the number of days to keep the session-cookie working. By default, it is 14 days
 * @returns number
 */
export function getSessionCookieTTL(days = 14) {
  const oneDayToMs = 8.64e7;

  return oneDayToMs * days;
}
