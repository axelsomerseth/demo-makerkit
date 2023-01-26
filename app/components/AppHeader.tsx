import React from 'react';
import { useAuth } from 'reactfire';
import ChevronRightIcon from '@heroicons/react/20/solid/ChevronRightIcon';

import useUserSession from '~/core/hooks/use-user-session';
import ProfileDropdown from '~/components/ProfileDropdown';
import MobileNavigation from '~/components/MobileNavigation';

import If from '~/core/ui/If';
import Heading from '~/core/ui/Heading';
import AppContainer from '~/components/AppContainer';
import OrganizationsSelector from '~/components/organizations/OrganizationsSelector';

const AppHeader: React.FCC = ({ children }) => {
  const userSession = useUserSession();
  const auth = useAuth();

  return (
    <div className="AppHeader">
      <AppContainer>
        <div className={'flex w-full flex-1 justify-between'}>
          <div
            className={
              'flex items-center justify-between space-x-2 lg:space-x-0'
            }
          >
            <div className={'lg:hidden'}>
              <MobileNavigation />
            </div>

            <div className={'flex items-center space-x-1 lg:space-x-2'}>
              <div className={'min-w-[8rem]'}>
                <If condition={userSession?.auth?.uid}>
                  {(uid) => <OrganizationsSelector userId={uid} />}
                </If>
              </div>

              <ChevronRightIcon className={'h-6'} />

              <Heading type={4}>
                <span className={'font-semibold dark:text-white'}>
                  {children}
                </span>
              </Heading>
            </div>
          </div>

          <div className={'flex items-center'}>
            <ProfileDropdown
              user={userSession?.auth}
              signOutRequested={() => auth.signOut()}
            />
          </div>
        </div>
      </AppContainer>
    </div>
  );
};

export default AppHeader;
