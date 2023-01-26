import { Outlet } from '@remix-run/react';

import SettingsContentContainer from '~/components/settings/SettingsContentContainer';
import OrganizationSettingsTabs from '~/components/organizations/OrganizationSettingsTabs';

function OrganizationSettingsLayout() {
  return (
    <>
      <div>
        <OrganizationSettingsTabs />
      </div>

      <SettingsContentContainer>
        <Outlet />
      </SettingsContentContainer>
    </>
  );
}

export default OrganizationSettingsLayout;
