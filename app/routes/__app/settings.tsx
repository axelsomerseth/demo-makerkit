import React from 'react';
import { Outlet } from '@remix-run/react';
import { Trans } from 'react-i18next';

import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import AppHeader from '~/components/AppHeader';
import AppContainer from '~/components/AppContainer';

const links = [
  {
    path: '/settings/profile',
    label: 'common:profileSettingsTabLabel',
  },
  {
    path: '/settings/organization',
    label: 'common:organizationSettingsTabLabel',
  },
  {
    path: '/settings/subscription',
    label: 'common:subscriptionSettingsTabLabel',
  },
];

function SettingsLayout() {
  return (
    <>
      <AppHeader>
        <Trans i18nKey={'common:settingsTabLabel'} />
      </AppHeader>

      <AppContainer>
        <NavigationMenu>
          {links.map((link) => (
            <NavigationItem link={link} key={link.path} />
          ))}
        </NavigationMenu>

        <div
          className={`flex flex-col space-y-4 md:space-y-0 lg:mt-8 lg:flex-row lg:space-x-16 xl:space-x-24`}
        >
          <Outlet />
        </div>
      </AppContainer>
    </>
  );
}

export default SettingsLayout;
