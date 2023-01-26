import { NavLink } from '@remix-run/react';
import { Trans } from 'react-i18next';
import classNames from 'classnames';

interface LinkModel {
  path: string;
  label: string;
}

const NavigationMenuItem: React.FCC<{
  link: LinkModel;
  end?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ link, className, end, disabled }) => {
  const label = link.label;

  return (
    <NavLink
      end={end}
      className={(props) => {
        return classNames(`NavigationItem`, className, {
          [`NavigationItemActive`]: props.isActive,
          [`NavigationItemNotActive`]: !props.isActive,
        });
      }}
      aria-disabled={disabled}
      to={disabled ? '' : link.path}
    >
      <Trans i18nKey={label} defaults={label} />
    </NavLink>
  );
};

export default NavigationMenuItem;
