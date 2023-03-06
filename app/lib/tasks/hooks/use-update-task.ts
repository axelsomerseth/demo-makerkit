import { doc, updateDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useFirestore } from 'reactfire';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';
import useRequestState from '~/core/hooks/use-request-state';

import type { Timestamp } from 'firebase/firestore';
import type { FirebaseError } from 'firebase/app';

function useUpdateTask() {
  const { state, setData, setError, setLoading } = useRequestState();
  const firestore = useFirestore();

  const updateTaskCallback = useCallback(
    async (
      taskId: string,
      name: string,
      description: string,
      dueDate: Timestamp
    ) => {
      try {
        setLoading(true);
        const docRef = doc(firestore, TASKS_COLLECTION, `/${taskId}`);
        const taskUpdate = { id: taskId, name, description, dueDate };
        await updateDoc(docRef, taskUpdate);
        setData(taskUpdate);
      } catch (error) {
        setError((error as FirebaseError).message);
      }
    },
    [setData, setError, setLoading, firestore]
  );

  return [updateTaskCallback, state] as [
    typeof updateTaskCallback,
    typeof state
  ];
}

export default useUpdateTask;
