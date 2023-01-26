import { useCallback } from 'react';
import { useUser } from 'reactfire';

import type { FirebaseError } from 'firebase/app';

import type { DocumentReference } from 'firebase/firestore';
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';

import useRequestState from '~/core/hooks/use-request-state';
import MembershipRole from '~/lib/organizations/types/membership-role';
import type Organization from '~/lib/organizations/types/organization';
import type UserData from '~/core/session/types/user-data';

import {
  ORGANIZATIONS_COLLECTION,
  USERS_COLLECTION,
} from '~/lib/firestore-collections';

/**
 * @name useCreateOrganization
 * @description Hook to create a new organization
 */
function useCreateOrganization() {
  const user = useUser();
  const userId = user.data?.uid as string;

  const { state, setError, setData, setLoading } =
    useRequestState<WithId<Organization>>();

  const createOrganizationCallback = useCallback(
    async (name: string) => {
      const firestore = getFirestore();
      const batch = writeBatch(firestore);

      try {
        setLoading(true);

        const organizations = collection(firestore, ORGANIZATIONS_COLLECTION);

        const userDoc = doc(
          firestore,
          USERS_COLLECTION,
          userId
        ) as DocumentReference<UserData>;

        const organizationDoc = doc(organizations);

        const organizationData = {
          name,
          members: {
            [userDoc.id]: {
              role: MembershipRole.Owner,
              user: userDoc,
            },
          },
        };

        batch.set(organizationDoc, organizationData);

        await batch.commit();

        setData({
          name,
          id: organizationDoc.id,
          members: {
            [userDoc.id]: {
              role: MembershipRole.Owner,
              user: userDoc,
            },
          },
        });
      } catch (e) {
        setError((e as FirebaseError).message);
      }
    },
    [setData, setError, setLoading, userId]
  );

  return [createOrganizationCallback, state] as [
    typeof createOrganizationCallback,
    typeof state
  ];
}

export default useCreateOrganization;
