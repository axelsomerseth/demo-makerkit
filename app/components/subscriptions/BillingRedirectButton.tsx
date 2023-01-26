import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

import Button from '~/core/ui/Button';
import useGetCsrfToken from '~/core/firebase/hooks/use-get-csrf-token';
import ClientOnly from '~/core/ui/ClientOnly';

import configuration from '~/configuration';
const BILLING_PORTAL_REDIRECT_ENDPOINT = configuration.paths.api.billingPortal;

const BillingPortalRedirectButton: React.FCC<{
  customerId: string;
  className?: string;
}> = ({ children, customerId, className }) => {
  return (
    <form method="POST" action={BILLING_PORTAL_REDIRECT_ENDPOINT}>
      <input type={'hidden'} name={'customerId'} value={customerId} />

      <ClientOnly>
        <CsrfTokenInput />
      </ClientOnly>

      <Button size={'large'} color={'secondary'} className={className}>
        <span className={'flex items-center space-x-2'}>
          <span>{children}</span>

          <ArrowRightIcon className={'h-6'} />
        </span>
      </Button>
    </form>
  );
};

function CsrfTokenInput() {
  const getCsrfToken = useGetCsrfToken();

  return (
    <input
      type="hidden"
      name={'csrfToken'}
      defaultValue={getCsrfToken() ?? ''}
    />
  );
}

export default BillingPortalRedirectButton;
