/**
 * @description Get the logged in user object using the session cookie
 * @param session
 */
export default async function getLoggedInUser(session: Maybe<string>) {
  if (!session) {
    return Promise.reject(`Session ID not found`);
  }

  const { getUserFromSessionCookie } = await import(
    './get-user-from-session-cookie'
  );

  return getUserFromSessionCookie(session);
}
