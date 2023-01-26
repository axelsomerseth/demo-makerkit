import { useNavigate } from '@remix-run/react';

import { Trans } from 'react-i18next';
import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import Button from '~/core/ui/Button';

function AuthCatchBoundary() {
  const navigate = useNavigate();

  return (
    <div className={'flex flex-col space-y-4'}>
      <AuthErrorMessage error={'generic'}></AuthErrorMessage>

      <Button onClick={() => navigate('.')}>
        <Trans i18nKey={'common:retry'} default={'Retry'} />
      </Button>
    </div>
  );
}

export default AuthCatchBoundary;
