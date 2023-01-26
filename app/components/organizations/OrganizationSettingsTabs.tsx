import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';

const links = {
  General: {
    path: '/settings/organization',
    label: 'organization:generalTabLabel',
  },
  Members: {
    path: '/settings/organization/members',
    label: 'organization:membersTabLabel',
  },
};

const OrganizationSettingsTabs = () => {
  const itemClassName = `flex justify-center lg:justify-start items-center flex-auto lg:flex-initial`;

  return (
    <div>
      <NavigationMenu secondary vertical>
        <NavigationItem end className={itemClassName} link={links.General} />
        <NavigationItem className={itemClassName} link={links.Members} />
      </NavigationMenu>
    </div>
  );
};

export default OrganizationSettingsTabs;
