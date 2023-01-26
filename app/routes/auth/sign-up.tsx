import type { MetaFunction } from '@remix-run/node';
import { Link, useSubmit, useTransition } from '@remix-run/react';
import { useCallback } from 'react';
import { Trans } from 'react-i18next';

import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';

import OAuthProviders from '~/components/auth/OAuthProviders';
import EmailLinkAuth from '~/components/auth/EmailLinkAuth';
import PhoneNumberSignInContainer from '~/components/auth/PhoneNumberSignInContainer';
import EmailPasswordSignUpContainer from '~/components/auth/EmailPasswordSignUpContainer';
import createServerSessionAction from '~/lib/server/auth/actions/create-server-session.action';
import useGetCsrfToken from '~/core/firebase/hooks/use-get-csrf-token';

import configuration from '~/configuration';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';
import AuthCatchBoundary from '~/components/auth/AuthCatchBoundary';

export const action = createServerSessionAction;
export const CatchBoundary = AuthCatchBoundary;

export const meta: MetaFunction = () => {
  return {
    title: 'Sign Up',
  };
};

const SIGN_IN_PATH = configuration.paths.signIn;

export default function SignUpPage() {
  const submit = useSubmit();
  const getCsrfToken = useGetCsrfToken();
  const transition = useTransition();

  const onSignUp = useCallback(
    (idToken: string) => {
      const csrfToken = getCsrfToken() ?? '';
      const payload = { idToken, csrfToken };

      submit(payload, {
        method: 'post',
      });
    },
    [getCsrfToken, submit]
  );

  if (transition.state !== 'idle') {
    return <PageLoadingIndicator />;
  }

  return (
    <>
      <div>
        <Heading type={4}>
          <Trans i18nKey={'auth:signUpHeading'} />
        </Heading>
      </div>

      <OAuthProviders onSignIn={onSignUp} />

      <If condition={configuration.auth.providers.emailPassword}>
        <div>
          <span className={'text-xs text-gray-400'}>
            <Trans i18nKey={'auth:orContinueWithEmail'} />
          </span>
        </div>

        <EmailPasswordSignUpContainer onSignUp={onSignUp} />
      </If>

      <If condition={configuration.auth.providers.phoneNumber}>
        <PhoneNumberSignInContainer onSignIn={onSignUp} />
      </If>

      <If condition={configuration.auth.providers.emailLink}>
        <EmailLinkAuth />
      </If>

      <div className={'flex justify-center text-xs'}>
        <p className={'flex space-x-1'}>
          <span>
            <Trans i18nKey={'auth:alreadyHaveAnAccount'} />
          </span>

          <Link
            className={'text-primary-800 hover:underline dark:text-primary-500'}
            to={SIGN_IN_PATH}
          >
            <Trans i18nKey={'auth:signIn'} />
          </Link>
        </p>
      </div>
    </>
  );
}
