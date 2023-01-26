import { createContext } from 'react';
import type UserSession from '~/core/session/types/user-session';

const UserSessionContext = createContext<{
  userSession: Maybe<UserSession>;
  setUserSession: (user: Maybe<UserSession>) => void;
}>({
  userSession: undefined,
  setUserSession: (_) => _,
});

export default UserSessionContext;
