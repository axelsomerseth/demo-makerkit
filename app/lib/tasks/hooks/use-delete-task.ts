import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { useCallback } from 'react';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

/**
 * @name useDeleteTask
 * @description Hook to delete an existing task
 */
function useDeleteTask() {
  const firestore = getFirestore();

  return useCallback(
    (taskId: string) => {
      const docRef = doc(firestore, `${TASKS_COLLECTION}/${taskId}`);

      return deleteDoc(docRef);
    },
    [firestore]
  );
}

export default useDeleteTask;
