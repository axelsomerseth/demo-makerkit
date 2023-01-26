import type { MetaFunction } from '@remix-run/node';
import { useCallback, useContext } from 'react';
import { Trans } from 'react-i18next';
import type { UserInfo } from 'firebase/auth';
import { useUser } from 'reactfire';

import FirebaseStorageProvider from '~/core/firebase/components/FirebaseStorageProvider';
import UserSessionContext from '~/core/session/contexts/user-session';

import UpdateProfileForm from '~/components/profile/UpdateProfileForm';
import SettingsTile from '~/components/settings/SettingsTile';

export const meta: MetaFunction = () => {
  return {
    title: 'Profile Settings',
  };
};

type ProfileData = Partial<UserInfo>;

const ProfileDetailsPage = () => {
  const { userSession, setUserSession } = useContext(UserSessionContext);
  const { data: user } = useUser();

  const onUpdate = useCallback(
    (data: ProfileData) => {
      const authData = userSession?.auth;

      if (authData) {
        setUserSession({
          auth: {
            ...authData,
            ...data,
          },
          data: userSession.data,
        });
      }
    },
    [setUserSession, userSession]
  );

  if (!user) {
    return null;
  }

  return (
    <SettingsTile
      heading={<Trans i18nKey={'profile:generalTab'} />}
      subHeading={<Trans i18nKey={'profile:generalTabSubheading'} />}
    >
      <FirebaseStorageProvider>
        <UpdateProfileForm user={user} onUpdate={onUpdate} />
      </FirebaseStorageProvider>
    </SettingsTile>
  );
};

export default ProfileDetailsPage;
