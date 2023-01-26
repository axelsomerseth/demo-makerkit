import { useFirestore, useFirestoreDocData } from 'reactfire';
import type { DocumentReference } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import type Organization from '~/lib/organizations/types/organization';
import { ORGANIZATIONS_COLLECTION } from '~/lib/firestore-collections';

type Response = WithId<Organization>;

/**
 * @name useFetchOrganization
 * @description Returns a stream with the selected organization's data
 * @param organizationId
 */
export default function useFetchOrganization(organizationId: string) {
  const firestore = useFirestore();

  const ref = doc(
    firestore,
    ORGANIZATIONS_COLLECTION,
    organizationId
  ) as DocumentReference<Response>;

  return useFirestoreDocData(ref, { idField: 'id' });
}
