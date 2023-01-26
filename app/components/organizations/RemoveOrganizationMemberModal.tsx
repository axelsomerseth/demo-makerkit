import { useCallback } from 'react';
import { Trans } from 'react-i18next';
import { t } from 'i18next';
import toaster from 'react-hot-toast';
import useRemoveMemberRequest from '~/lib/organizations/hooks/use-remove-member';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';

import type { SerializedUserAuthData } from '~/core/session/types/user-session';

const RemoveOrganizationMemberModal: React.FCC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  member: SerializedUserAuthData;
}> = ({ isOpen, setIsOpen, member }) => {
  const [removeMemberRequest, { loading }] = useRemoveMemberRequest(member.uid);

  const onUserRemoved = useCallback(async () => {
    await toaster.promise(removeMemberRequest(), {
      success: t<string>(`removeMemberSuccessMessage`),
      error: t<string>(`removeMemberErrorMessage`),
      loading: t<string>(`removeMemberLoadingMessage`),
    });

    setIsOpen(false);
  }, [removeMemberRequest, setIsOpen]);

  const heading = <Trans i18nKey="organization:removeMemberModalHeading" />;

  return (
    <Modal heading={heading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={'flex flex-col space-y-4'}>
        <p>
          <Trans i18nKey={'common:modalConfirmationQuestion'} />
        </p>

        <Button
          block
          data-cy={'confirm-remove-member'}
          color={'danger'}
          onClick={onUserRemoved}
          loading={loading}
        >
          <Trans i18nKey={'organization:removeMemberSubmitLabel'} />
        </Button>
      </div>
    </Modal>
  );
};

export default RemoveOrganizationMemberModal;
