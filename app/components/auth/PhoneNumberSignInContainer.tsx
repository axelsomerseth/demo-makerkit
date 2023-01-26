import { useCallback } from 'react';
import type { UserCredential } from 'firebase/auth';
import PhoneNumberCredentialForm from '~/components/auth/PhoneNumberCredentialForm';

const PhoneNumberSignInContainer: React.FC<{
  onSignIn: (idToken: string) => unknown;
}> = ({ onSignIn }) => {
  const onSuccess = useCallback(
    async (credential: UserCredential) => {
      const idToken = await credential.user.getIdToken();

      onSignIn(idToken);
    },
    [onSignIn]
  );

  return <PhoneNumberCredentialForm action={'signIn'} onSuccess={onSuccess} />;
};

export default PhoneNumberSignInContainer;
