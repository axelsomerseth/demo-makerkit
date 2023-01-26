import { useCallback, useEffect, useRef } from 'react';
import type { FirebaseError } from 'firebase/app';
import type { User } from 'firebase/auth';

import If from '~/core/ui/If';
import { useSignUpWithEmailAndPassword } from '~/core/firebase/hooks';
import getFirebaseErrorCode from '~/core/firebase/utils/get-firebase-error-code';

import AuthErrorMessage from './AuthErrorMessage';
import EmailPasswordSignUpForm from '~/components/auth/EmailPasswordSignUpForm';

const EmailPasswordSignUpContainer: React.FCC<{
  onSignUp: (idToken: string) => unknown;
  onError?: (error: FirebaseError) => unknown;
}> = ({ onSignUp, onError }) => {
  const [signUp, state] = useSignUpWithEmailAndPassword();
  const redirecting = useRef(false);

  const loading = state.loading || redirecting.current;

  const callOnErrorCallback = useCallback(() => {
    if (state.error && onError) {
      onError(state.error);
    }
  }, [state.error, onError]);

  const createSession = useCallback(
    async (user: User) => {
      // using the ID token, we will make a request to initiate the session
      // to make SSR possible via session cookie
      const idToken = await user.getIdToken();

      redirecting.current = true;

      // we notify the parent component that
      // the user signed up successfully, so they can be redirected
      onSignUp(idToken);
    },
    [onSignUp]
  );

  useEffect(() => {
    callOnErrorCallback();
  }, [callOnErrorCallback]);

  const onSubmit = useCallback(
    async (params: { email: string; password: string }) => {
      if (loading) {
        return;
      }

      const credential = await signUp(params.email, params.password);

      if (credential) {
        await createSession(credential.user);
      }
    },
    [loading, signUp, createSession]
  );

  return (
    <>
      <If condition={state.error}>
        {(error) => <AuthErrorMessage error={getFirebaseErrorCode(error)} />}
      </If>

      <EmailPasswordSignUpForm onSubmit={onSubmit} loading={loading} />
    </>
  );
};

export default EmailPasswordSignUpContainer;
