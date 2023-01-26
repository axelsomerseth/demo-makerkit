import { getAuth } from 'firebase-admin/auth';
import getLogger from '~/core/logger';
import serializeAuthUser from '~/core/firebase/utils/serialize-auth-user';

/**
 * @description Serializes safely the user object
 * @param userId
 */
export default async function getUserInfoById(userId: string) {
  const auth = getAuth();
  const logger = getLogger();

  try {
    const user = await auth.getUser(userId);

    if (!user) {
      return null;
    }

    return serializeAuthUser(user);
  } catch (e) {
    logger.warn(
      {
        userId,
      },
      `User was not found`
    );

    return;
  }
}
