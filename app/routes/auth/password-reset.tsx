import type { FormEvent } from 'react';
import { useCallback } from 'react';
import { Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { sendPasswordResetEmail } from '@firebase/auth';
import { Trans } from 'react-i18next';
import { useAuth } from 'reactfire';

import configuration from '~/configuration';

import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';
import TextField from '~/core/ui/TextField';

import getFirebaseErrorCode from '~/core/firebase/utils/get-firebase-error-code';
import useRequestState from '~/core/hooks/use-request-state';
import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import loadAuthPageData from '~/lib/server/loaders/load-auth-page-data';

export const loader = loadAuthPageData;

export const meta: MetaFunction = () => {
  return {
    title: 'Password Reset',
  };
};

function PasswordResetPage() {
  const auth = useAuth();
  const { state, setError, setData, setLoading } = useRequestState();

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const email = data.get('email') as string;

      setLoading(true);

      try {
        const returnUrl = getReturnUrl();

        await sendPasswordResetEmail(auth, email, {
          url: returnUrl,
        });

        setData(true);
      } catch (e) {
        setError(getFirebaseErrorCode(e));
      }
    },
    [auth, setData, setError, setLoading]
  );

  return (
    <>
      <div>
        <Heading type={4}>
          <Trans i18nKey={'auth:passwordResetLabel'} />
        </Heading>
      </div>

      <div className={'flex flex-col space-y-4'}>
        <If condition={state.success}>
          <Alert type={'success'}>
            <Trans i18nKey={'auth:passwordResetSuccessMessage'} />
          </Alert>
        </If>

        <If condition={!state.data}>
          <>
            <form
              onSubmit={(e) => void onSubmit(e)}
              className={'container mx-auto flex justify-center'}
            >
              <div className={'flex-col space-y-4'}>
                <div>
                  <p className={'text-sm text-gray-700 dark:text-gray-400'}>
                    <Trans i18nKey={'auth:passwordResetSubheading'} />
                  </p>
                </div>

                <div>
                  <TextField.Label>
                    <Trans i18nKey={'common:emailAddress'} />

                    <TextField.Input
                      name="email"
                      required
                      type="email"
                      placeholder={'your@email.com'}
                    />
                  </TextField.Label>
                </div>

                <If condition={state.error}>
                  <AuthErrorMessage error={state.error as string} />
                </If>

                <Button
                  loading={state.loading}
                  type="submit"
                  size="large"
                  block
                >
                  <Trans i18nKey={'auth:passwordResetLabel'} />
                </Button>
              </div>
            </form>
          </>
        </If>

        <div className={'flex justify-center text-xs'}>
          <p className={'flex space-x-1'}>
            <span>
              <Trans i18nKey={'auth:passwordRecoveredQuestion'} />
            </span>

            <Link
              className={
                'text-primary-800 hover:underline dark:text-primary-500'
              }
              to={configuration.paths.signIn}
            >
              <Trans i18nKey={'auth:signIn'} />
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default PasswordResetPage;

/**
 * @description
 * Return the URL where the user will be redirected to after resetting
 * their password. By default, we will redirect to the sign-in page
 */
function getReturnUrl() {
  return `${window.location.origin}${configuration.paths.signIn}`;
}
