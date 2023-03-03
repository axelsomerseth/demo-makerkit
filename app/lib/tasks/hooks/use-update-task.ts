import useRequestState from '~/core/hooks/use-request-state';

import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useFirestore } from 'reactfire';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

import type { FirebaseError } from 'firebase/app';

function useUpdateTask() {
  const { state, setData, setError, setLoading } = useRequestState();
  // TODO: write down the steps you will follow to update a task.
  //1 referencia de firestore
  const firestore = useFirestore();
  //2 referencia del documento
  //3 actualizar el documento

  const updateTask = useCallback(
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
    [setData, setError, setLoading]
  );

  return [updateTask, state] as [typeof updateTask, typeof state];
}

export default useUpdateTask;
