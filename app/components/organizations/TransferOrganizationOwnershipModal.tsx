import { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import toaster from 'react-hot-toast';

import useTransferOrganizationOwnership from '~/lib/organizations/hooks/use-transfer-organization-ownership';
import type { SerializedUserAuthData } from '~/core/session/types/user-session';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import If from '~/core/ui/If';

const TransferOrganizationOwnershipModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  member: SerializedUserAuthData;
}> = ({ isOpen, setIsOpen, member }) => {
  const targetMemberDisplayName = member.displayName ?? member.email;
  const targetMemberId = member.uid;
  const { t } = useTranslation();
  const heading = <Trans i18nKey="organization:transferOwnership" />;

  const [transferOrganizationOwnership, transferOrganizationOwnershipState] =
    useTransferOrganizationOwnership();

  const loading = transferOrganizationOwnershipState.loading;

  const onConfirmTransferOwnership = useCallback(async () => {
    const promise = transferOrganizationOwnership({
      userId: targetMemberId,
    });

    await toaster.promise(promise, {
      loading: t<string>('organization:transferringOwnership'),
      success: t<string>('organization:transferOwnershipSuccess'),
      error: t<string>('organization:transferOwnershipError'),
    });

    setIsOpen(false);
  }, [setIsOpen, t, targetMemberId, transferOrganizationOwnership]);

  return (
    <Modal heading={heading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={'flex flex-col space-y-4'}>
        <p>
          <Trans
            i18nKey={'organization:transferOwnershipDisclaimer'}
            values={{
              member: targetMemberDisplayName,
            }}
            components={{ b: <b /> }}
          />
        </p>

        <p>
          <Trans i18nKey={'common:modalConfirmationQuestion'} />
        </p>

        <Button
          block
          data-cy={'confirm-transfer-ownership-button'}
          color={'danger'}
          onClick={onConfirmTransferOwnership}
          loading={loading}
        >
          <If
            condition={loading}
            fallback={<Trans i18nKey={'organization:transferOwnership'} />}
          >
            <Trans i18nKey={'organization:transferringOwnership'} />
          </If>
        </Button>
      </div>
    </Modal>
  );
};

export default TransferOrganizationOwnershipModal;
