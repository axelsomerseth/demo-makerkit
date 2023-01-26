import { useCallback, useState } from 'react';
import toaster from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import Label from '~/core/ui/Label';

import type MembershipRole from '~/lib/organizations/types/membership-role';
import MembershipRoleSelector from './MembershipRoleSelector';
import useUpdateMemberRequest from '~/lib/organizations/hooks/use-update-member-role';
import type { SerializedUserAuthData } from '~/core/session/types/user-session';

const UpdateMemberRoleModal: React.FCC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  member: SerializedUserAuthData;
  memberRole: MembershipRole;
}> = ({ isOpen, setIsOpen, memberRole, member }) => {
  const { t } = useTranslation('organization');
  const [role, setRole] = useState<MembershipRole>(memberRole);
  const [updateMember, state] = useUpdateMemberRequest(member.uid);

  const onRoleUpdated = useCallback(async () => {
    if (role === memberRole) {
      const message = t<string>('chooseDifferentRoleError');

      toaster.error(message, {
        className: 'chooseDifferentRoleError',
      });

      return;
    }

    const promise = updateMember({ role });

    await toaster.promise(promise, {
      loading: t<string>('updateRoleLoadingMessage'),
      success: t<string>('updateRoleSuccessMessage'),
      error: t<string>('updatingRoleErrorMessage'),
    });

    setIsOpen(false);
  }, [role, memberRole, updateMember, t, setIsOpen]);

  const heading = (
    <Trans i18nKey={'organization:updateMemberRoleModalHeading'} />
  );

  return (
    <Modal heading={heading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={'flex flex-col space-y-12'}>
        <div className={'flex flex-col space-y-1'}>
          <Label>
            <Trans i18nKey={'organization:memberRoleInputLabel'} />
          </Label>

          <MembershipRoleSelector value={memberRole} onChange={setRole} />
        </div>

        <Button
          data-cy={'confirm-update-member-role'}
          block
          loading={state.loading}
          onClick={onRoleUpdated}
        >
          <Trans i18nKey={'organization:updateRoleSubmitLabel'} />
        </Button>
      </div>
    </Modal>
  );
};

export default UpdateMemberRoleModal;
