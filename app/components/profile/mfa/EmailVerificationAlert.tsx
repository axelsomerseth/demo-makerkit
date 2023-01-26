import type { User } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import { Trans, useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import toaster from 'react-hot-toast';

import useRequestState from '~/core/hooks/use-request-state';
import Alert from '~/core/ui/Alert';
import If from '~/core/ui/If';
import Button from '~/core/ui/Button';

import getFirebaseErrorCode from '~/core/firebase/utils/get-firebase-error-code';
import AuthErrorMessage from '~/components/auth/AuthErrorMessage';

function EmailVerificationAlert(
  props: React.PropsWithChildren<{
    user: User;
  }>
) {
  const requestState = useRequestState<void>();
  const { t } = useTranslation();

  const onLinkRequested = useCallback(async () => {
    requestState.setLoading(true);

    const promise = sendEmailVerification(props.user)
      .then(() => {
        requestState.setData();
      })
      .catch((error) => {
        requestState.setError(error);

        throw getFirebaseErrorCode(error);
      });

    await toaster.promise(promise, {
      loading: t<string>(`profile:sendingEmailVerificationLink`),
      success: t<string>(`profile:sendEmailVerificationLinkSuccess`),
      error: t<string>(`profile:sendEmailVerificationLinkError`),
    });
  }, [props, requestState, t]);

  return (
    <div className={'flex flex-col space-y-3'}>
      <div>
        <Alert type={'warn'}>
          <Alert.Heading>
            <Trans i18nKey={'profile:verifyEmailAlertHeading'} />
          </Alert.Heading>

          <div>
            <p>
              <Trans i18nKey={'profile:verificationLinkAlertDescription'} />
            </p>
          </div>
        </Alert>
      </div>

      <If condition={requestState.state.error}>
        <div>
          <AuthErrorMessage
            error={getFirebaseErrorCode(requestState.state.error)}
          />
        </div>
      </If>

      <div>
        <If
          condition={requestState.state.success}
          fallback={
            <Button
              loading={requestState.state.loading}
              onClick={onLinkRequested}
            >
              <Trans i18nKey={'profile:sendVerificationLinkSubmitLabel'} />
            </Button>
          }
        >
          <EmailSentSuccessAlert />
        </If>
      </div>
    </div>
  );
}

function EmailSentSuccessAlert() {
  return (
    <Alert type={'success'}>
      <span>
        <Trans i18nKey={'profile:sendVerificationLinkSuccessLabel'} />
      </span>
    </Alert>
  );
}

export default EmailVerificationAlert;
