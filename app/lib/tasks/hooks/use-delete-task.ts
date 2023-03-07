import { deleteDoc, doc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useFirestore } from 'reactfire';
import useRequestState from '~/core/hooks/use-request-state';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

import type { Task } from '../types/task';
import type { FirebaseError } from 'firebase/app';

function useDeleteTask() {
  const firestore = useFirestore();
  const { setLoading, setData, setError, state } = useRequestState();

  const deleteTaskCallback = useCallback(
    async (task: Task) => {
      setLoading(true);
      try {
        const docRef = doc(
          firestore,
          TASKS_COLLECTION,
          `/${task.id as string}`
        );
        await deleteDoc(docRef);
        setData({ deleted: true });
      } catch (error) {
        setError((error as FirebaseError).message);
        console.error(error);
      }
    },
    [firestore, setLoading, setData, setError]
  );

  return [deleteTaskCallback, state] as [
    typeof deleteTaskCallback,
    typeof state
  ];
}

export default useDeleteTask;
