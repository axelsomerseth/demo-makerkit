import React from 'react';
import type { MetaFunction } from '@remix-run/node';
import { Trans } from 'react-i18next';

import DashboardDemo from '~/components/dashboard/DashboardDemo';
import ClientOnly from '~/core/ui/ClientOnly';
import AppHeader from '~/components/AppHeader';
import AppContainer from '~/components/AppContainer';

export const meta: MetaFunction = () => {
  return {
    title: 'Dashboard',
  };
};

function DashboardPage() {
  return (
    <>
      <AppHeader>
        <Trans i18nKey={'common:dashboardTabLabel'} />
      </AppHeader>

      <ClientOnly>
        <AppContainer>
          <DashboardDemo />
        </AppContainer>
      </ClientOnly>
    </>
  );
}

export default DashboardPage;
