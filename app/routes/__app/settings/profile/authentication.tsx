import { useCallback, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import type { MetaFunction } from '@remix-run/node';

import SettingsTile from '~/components/settings/SettingsTile';
import ConnectedAccountsContainer from '~/components/profile/accounts/ConnectedAccountsContainer';
import MultiFactorAuthSetupContainer from '~/components/profile/mfa/MultiFactorAuthSetupContainer';
import DisableMultiFactorButton from '~/components/profile/mfa/DisableMultiFactorButton';
import ReauthenticationModal from '~/components/auth/ReauthenticationModal';

import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';
import Heading from '~/core/ui/Heading';

import configuration from '~/configuration';
import useUserSession from '~/core/hooks/use-user-session';

export const meta: MetaFunction = () => {
  return {
    title: 'Authentication',
  };
};

const ProfileAuthenticationPage = () => {
  const user = useUserSession();

  const multiFactor = useMemo(
    () => user?.auth?.multiFactor ?? [],
    [user?.auth?.multiFactor]
  );

  const [shouldReauthenticate, setShouldReauthenticate] = useState(false);

  const refreshPage = useCallback((success: boolean) => {
    if (success) {
      // this little trick forces the page to refresh
      // it's quick & dirty way to provide UI feedback with the updated
      // user data when enabling/disabling MFA
      window.location.reload();
    }
  }, []);

  return (
    <>
      <div className={'flex flex-col space-y-8'}>
        <SettingsTile
          heading={<Trans i18nKey={'profile:manageConnectedAccounts'} />}
          subHeading={
            <Trans i18nKey={'profile:manageConnectedAccountsSubheading'} />
          }
        >
          <ConnectedAccountsContainer />
        </SettingsTile>

        {/* DISPLAY TILE IF APP SUPPORTS MFA */}
        <If condition={configuration.auth.enableMultiFactorAuth}>
          <SettingsTile
            heading={<Trans i18nKey={'profile:multiFactorAuth'} />}
            subHeading={<Trans i18nKey={'profile:multiFactorAuthSubheading'} />}
          >
            {/* MFA DISABLED BY USER: SHOW SETUP CONTAINER */}
            <If condition={!multiFactor}>
              <MultiFactorAuthSetupContainer onComplete={refreshPage} />
            </If>

            {/* MFA ENABLED BY USER: SHOW DISABLE BUTTON */}
            <If condition={multiFactor}>
              <div className={'flex flex-col space-y-2'}>
                <MultiFactorSuccessAlert />

                <DisableMultiFactorButton
                  onDisable={async () => {
                    // After the user Disables MFA, Firebase will revoke the
                    // session cookie permissions. We must ask the user
                    // to reauthenticate
                    setShouldReauthenticate(true);
                  }}
                />
              </div>
            </If>

            <If condition={shouldReauthenticate}>
              <ReauthenticationModal
                isOpen={true}
                setIsOpen={async () => {
                  setShouldReauthenticate(false);

                  // After the user Disables MFA, Firebase will revoke the
                  // session cookie permissions. Therefore, we need to
                  // refresh the page only after reauthenticating
                  await refreshPage(true);
                }}
              />
            </If>
          </SettingsTile>
        </If>
      </div>
    </>
  );
};

export default ProfileAuthenticationPage;

function MultiFactorSuccessAlert() {
  return (
    <Alert type={'success'} className={'flex flex-col space-y-2'}>
      <Heading type={4}>
        <Trans i18nKey={'profile:mfaEnabledSuccessTitle'} />
      </Heading>

      <p>
        <Trans i18nKey={'profile:mfaEnabledSuccessDescription'} />
      </p>
    </Alert>
  );
}
