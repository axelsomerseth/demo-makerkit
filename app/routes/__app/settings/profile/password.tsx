import type { MetaFunction } from '@remix-run/node';
import { useUser } from 'reactfire';

import { Trans } from 'react-i18next';
import { EmailAuthProvider } from 'firebase/auth';

import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';

import UpdatePasswordForm from '~/components/profile/UpdatePasswordForm';
import SettingsTile from '~/components/settings/SettingsTile';

export const meta: MetaFunction = () => {
  return {
    title: 'Update Password',
  };
};

const ProfilePasswordSettings = () => {
  const { data: user } = useUser();

  if (!user) {
    return null;
  }

  const canUpdatePassword = user.providerData.find(
    (item) => item.providerId === EmailAuthProvider.PROVIDER_ID
  );

  return (
    <SettingsTile
      heading={<Trans i18nKey={'profile:passwordTab'} />}
      subHeading={<Trans i18nKey={'profile:passwordTabSubheading'} />}
    >
      <If
        condition={canUpdatePassword}
        fallback={<WarnCannotUpdatePasswordAlert />}
      >
        <UpdatePasswordForm user={user} />
      </If>
    </SettingsTile>
  );
};

function WarnCannotUpdatePasswordAlert() {
  return (
    <Alert type={'warn'}>
      <Trans i18nKey={'profile:cannotUpdatePassword'} />
    </Alert>
  );
}

export default ProfilePasswordSettings;
