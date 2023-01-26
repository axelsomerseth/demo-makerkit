import useApiRequest from '~/core/hooks/use-api';

type TargetMemberId = string;

function useTransferOrganizationOwnership() {
  return useApiRequest<void, { userId: TargetMemberId }>(
    `/settings/organization/members/owner`,
    'PUT'
  );
}

export default useTransferOrganizationOwnership;
