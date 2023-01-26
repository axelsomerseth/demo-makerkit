import { Outlet } from '@remix-run/react';
import ProfileSettingsTabs from '~/components/profile/ProfileSettingsTabs';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';

function ProfileSettingsLayout() {
  return (
    <>
      <div>
        <ProfileSettingsTabs />
      </div>

      <SettingsContentContainer>
        <Outlet />
      </SettingsContentContainer>
    </>
  );
}

export default ProfileSettingsLayout;
