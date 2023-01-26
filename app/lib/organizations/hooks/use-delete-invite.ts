import { useFirestore } from 'reactfire';
import { deleteDoc, doc } from 'firebase/firestore';
import { useCallback } from 'react';

import {
  INVITES_COLLECTION,
  ORGANIZATIONS_COLLECTION,
} from '~/lib/firestore-collections';

function useDeleteInvite() {
  const firestore = useFirestore();

  return useCallback(
    (organizationId: string, inviteId: string) => {
      const path = getDeleteInvitePath(organizationId, inviteId);
      const docRef = doc(firestore, path);

      return deleteDoc(docRef);
    },
    [firestore]
  );
}

/**
 * @name getDeleteInvitePath
 * @param organizationId
 * @param inviteId
 * @description Builds path to the collection document to delete
 */
function getDeleteInvitePath(organizationId: string, inviteId: string) {
  return [
    ORGANIZATIONS_COLLECTION,
    organizationId,
    INVITES_COLLECTION,
    inviteId,
  ].join('/');
}

export default useDeleteInvite;
