import type UserData from '~/core/session/types/user-data';
import type serializeAuthUser from '~/core/firebase/utils/serialize-auth-user';

export type SerializedUserAuthData = ReturnType<typeof serializeAuthUser>;

/**
 * This interface combines the user's metadata from
 * Firebase Auth and the user's record in Firestore
 */
interface UserSession {
  auth: Maybe<SerializedUserAuthData>;
  data: Maybe<UserData>;
}

export default UserSession;
