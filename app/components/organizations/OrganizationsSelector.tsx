import { useCallback, useContext, useState } from 'react';
import { Trans } from 'react-i18next';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import type Organization from '~/lib/organizations/types/organization';
import useFetchUserOrganizations from '~/lib/organizations/hooks/use-fetch-user-organizations';
import OrganizationContext from '~/lib/contexts/organization';
import { setCookie } from '~/core/generic/cookies';

import { PopoverDropdown, PopoverDropdownItem } from '~/core/ui/Popover';
import If from '~/core/ui/If';

import CreateOrganizationModal from './CreateOrganizationModal';
import ClientOnly from '~/core/ui/ClientOnly';

const PopoverButton: React.FCC<{
  organization: Maybe<WithId<Organization>>;
}> = ({ organization }) => {
  if (organization) {
    return <OrganizationItem organization={organization} />;
  }

  return null;
};

const OrganizationsSelector: React.FCC<{ userId: string }> = ({ userId }) => {
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const { organization, setOrganization } = useContext(OrganizationContext);

  const organizationSelected = useCallback(
    (item: WithId<Organization>) => {
      // update the global Organization context
      // with the selected organization
      setOrganization(item);

      // we save the selected organization in
      // a cookie so that we can return to it when
      // the user refreshes or navigates elsewhere
      saveOrganizationIdInCookie(item.id);
    },
    [setOrganization]
  );

  return (
    <>
      <div data-cy={'organization-selector'}>
        <PopoverDropdown button={<PopoverButton organization={organization} />}>
          <ClientOnly>
            <OrganizationsOptions
              organizationId={organization?.id}
              userId={userId}
              onSelect={organizationSelected}
            />
          </ClientOnly>

          <PopoverDropdownItem
            className={'border-t border-gray-100 dark:border-black-400'}
            onClick={() => setIsOrganizationModalOpen(true)}
          >
            <PopoverDropdownItem.Label>
              <span
                data-cy={'create-organization-button'}
                className={'flex flex-row items-center space-x-2 ellipsify'}
              >
                <PlusCircleIcon className={'h-5'} />

                <span>
                  <Trans
                    i18nKey={'organization:createOrganizationDropdownLabel'}
                  />
                </span>
              </span>
            </PopoverDropdownItem.Label>
          </PopoverDropdownItem>
        </PopoverDropdown>
      </div>

      <CreateOrganizationModal
        setIsOpen={setIsOrganizationModalOpen}
        isOpen={isOrganizationModalOpen}
        onCreate={organizationSelected}
      />
    </>
  );
};

function OrganizationsOptions(
  props: React.PropsWithChildren<{
    userId: string;
    organizationId: Maybe<string>;
    onSelect: (organization: WithId<Organization>) => unknown;
  }>
) {
  const { data: organizations, status } = useFetchUserOrganizations(
    props.userId
  );

  if (status !== 'success') {
    return null;
  }

  return (
    <>
      {(organizations ?? []).map((item) => {
        const isSelected = item.id === props.organizationId;

        if (!isSelected) {
          return (
            <PopoverDropdownItem
              key={item.name}
              onClick={() => props.onSelect(item)}
            >
              <PopoverDropdownItem.Label>
                <OrganizationItem organization={item} />
              </PopoverDropdownItem.Label>
            </PopoverDropdownItem>
          );
        }

        return null;
      })}
    </>
  );
}

function OrganizationItem({ organization }: { organization: Organization }) {
  const { logoURL, name } = organization;
  const imageSize = 18;

  return (
    <span
      data-cy={'organization-selector-item'}
      className={`flex max-w-[12rem] items-center space-x-2`}
    >
      <If condition={logoURL}>
        <span className={'flex items-center'}>
          <img
            decoding={'async'}
            loading={'lazy'}
            style={{
              width: imageSize,
              height: imageSize,
            }}
            width={imageSize}
            height={imageSize}
            alt={`${name} Logo`}
            className={'object-contain'}
            src={logoURL as string}
          />
        </span>
      </If>

      <span className={'w-auto text-left font-medium ellipsify'}>{name}</span>
    </span>
  );
}

function saveOrganizationIdInCookie(id: string) {
  setCookie('organizationId', id);
}

export default OrganizationsSelector;
