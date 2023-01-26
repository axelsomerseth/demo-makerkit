import { useCallback, useState } from 'react';

import type { MultiFactorError, Auth } from 'firebase/auth';
import {
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

import { useAuth } from 'reactfire';

import MultiFactorAuthChallengeModal from '~/components/auth/MultiFactorAuthChallengeModal';
import isMultiFactorError from '~/core/firebase/utils/is-multi-factor-error';

import getFirebaseErrorCode from '~/core/firebase/utils/get-firebase-error-code';
import useRequestState from '~/core/hooks/use-request-state';

import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import EmailPasswordSignInForm from '~/components/auth/EmailPasswordSignInForm';

import If from '~/core/ui/If';

const EmailPasswordSignInContainer: React.FCC<{
  onSignIn: (idToken: string) => unknown;
}> = ({ onSignIn }) => {
  const auth = useAuth();
  const requestState = useRequestState<void>();

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const isLoading = requestState.state.loading;

  const signInWithCredentials = useCallback(
    async (params: { email: string; password: string }) => {
      if (isLoading) {
        return;
      }

      requestState.setLoading(true);

      try {
        const credential = await getCredential(auth, params);

        if (credential) {
          // using the ID token, we will make a request to initiate the session
          // to make SSR possible via session cookie
          const idToken = await credential.user.getIdToken();

          // we notify the parent component that
          // the user signed in successfully, so they can be redirected
          onSignIn(idToken);
        }
      } catch (error) {
        if (isMultiFactorError(error)) {
          setMultiFactorAuthError(error);
        } else {
          requestState.setError(error);
        }
      }
    },
    [isLoading, auth, onSignIn, requestState]
  );

  return (
    <>
      <If condition={requestState.state.error}>
        <AuthErrorMessage
          error={getFirebaseErrorCode(requestState.state.error)}
        />
      </If>

      <EmailPasswordSignInForm
        onSubmit={signInWithCredentials}
        loading={isLoading}
      />

      <If condition={multiFactorAuthError}>
        {(error) => (
          <MultiFactorAuthChallengeModal
            error={error}
            isOpen={true}
            setIsOpen={(isOpen) => {
              setMultiFactorAuthError(undefined);

              // when the MFA modal gets closed without verification
              // we reset the state
              if (!isOpen) {
                requestState.resetState();
              }
            }}
            onSuccess={async (credential) => {
              const idToken = await credential.user.getIdToken();

              // we notify the parent component that
              // the user signed in successfully, so they can be redirected
              onSignIn(idToken);
            }}
          />
        )}
      </If>
    </>
  );
};

async function getCredential(
  auth: Auth,
  params: { email: string; password: string }
) {
  const { email, password } = params;
  const user = auth.currentUser;

  if (user) {
    const credential = EmailAuthProvider.credential(email, password);

    return reauthenticateWithCredential(user, credential);
  }

  return signInWithEmailAndPassword(auth, email, password);
}

export default EmailPasswordSignInContainer;
