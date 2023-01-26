import { NavLink } from '@remix-run/react';
import { Trans } from 'react-i18next';
import classNames from 'classnames';
import Tooltip from '~/core/ui/Tooltip';

import NAVIGATION_CONFIG from '../navigation.config';

function AppSidebarNavigation({
  collapsed,
}: React.PropsWithChildren<{
  collapsed: boolean;
}>) {
  const iconClassName = classNames('AppSidebarItemIcon', {
    'h-6': !collapsed,
    'h-7': collapsed,
  });

  return (
    <div className={'flex flex-col space-y-1.5'}>
      {NAVIGATION_CONFIG.items.map((item) => {
        const Label = <Trans i18nKey={item.label} defaults={item.label} />;

        return (
          <AppSidebarItem key={item.path} href={item.path}>
            <Tooltip placement={'right'} content={collapsed ? Label : null}>
              <item.Icon className={iconClassName} />
            </Tooltip>

            <span>{Label}</span>
          </AppSidebarItem>
        );
      })}
    </div>
  );
}

function AppSidebarItem({
  children,
  href,
}: React.PropsWithChildren<{
  href: string;
}>) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) => {
        return classNames(`AppSidebarItem`, {
          AppSidebarItemActive: isActive,
          AppSidebarItemNotActive: !isActive,
        });
      }}
    >
      {children}
    </NavLink>
  );
}

export default AppSidebarNavigation;
