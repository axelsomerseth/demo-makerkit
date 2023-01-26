import type { MetaFunction } from '@remix-run/node';

import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import Plans from '~/components/subscriptions/Plans';
import SettingsTile from '~/components/settings/SettingsTile';

import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';
enum SubscriptionStatusQueryParams {
  Success = 'success',
  Cancel = 'cancel',
  Error = 'error',
}

export const meta: MetaFunction = () => {
  return {
    title: 'Subscription',
  };
};

const SubscriptionSettingsPage = () => {
  const status = useSubscriptionStatus();

  return (
    <>
      <div className={'w-full'}>
        <SettingsTile
          heading={<Trans i18nKey={'common:subscriptionSettingsTabLabel'} />}
          subHeading={
            <Trans i18nKey={'subscription:subscriptionTabSubheading'} />
          }
        >
          <div className={'flex flex-col space-y-4'}>
            <If condition={status !== undefined}>
              <PlansStatusAlert
                status={status as SubscriptionStatusQueryParams}
              />
            </If>

            <Plans />
          </div>
        </SettingsTile>
      </div>
    </>
  );
};

export default SubscriptionSettingsPage;

function PlansStatusAlert({
  status,
}: {
  status: SubscriptionStatusQueryParams;
}) {
  switch (status) {
    case SubscriptionStatusQueryParams.Cancel:
      return (
        <Alert type={'warn'} useCloseButton={true}>
          <Alert.Heading>
            <Trans i18nKey={'subscription:checkOutCanceledAlertHeading'} />
          </Alert.Heading>

          <p>
            <Trans i18nKey={'subscription:checkOutCanceledAlert'} />
          </p>
        </Alert>
      );

    case SubscriptionStatusQueryParams.Error:
      return (
        <Alert type={'error'} useCloseButton={true}>
          <Alert.Heading>
            <Trans i18nKey={'subscription:unknownErrorAlertHeading'} />
          </Alert.Heading>

          <p>
            <Trans i18nKey={'subscription:unknownErrorAlert'} />
          </p>
        </Alert>
      );

    case SubscriptionStatusQueryParams.Success:
      return (
        <Alert type={'success'} useCloseButton={true}>
          <Alert.Heading>
            <Trans i18nKey={'subscription:checkOutCompletedAlertHeading'} />
          </Alert.Heading>

          <p>
            <Trans i18nKey={'subscription:checkOutCompletedAlert'} />
          </p>
        </Alert>
      );
  }
}

function useSubscriptionStatus() {
  const [status, setStatus] = useState<SubscriptionStatusQueryParams>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const error = params.has(SubscriptionStatusQueryParams.Error);
    const canceled = params.has(SubscriptionStatusQueryParams.Cancel);
    const success = params.has(SubscriptionStatusQueryParams.Success);

    if (canceled) {
      setStatus(SubscriptionStatusQueryParams.Cancel);
    } else if (success) {
      setStatus(SubscriptionStatusQueryParams.Success);
    } else if (error) {
      setStatus(SubscriptionStatusQueryParams.Error);
    }
  }, []);

  return status;
}
