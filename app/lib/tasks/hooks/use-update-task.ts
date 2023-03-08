import { FirebaseError } from 'firebase/app';
import { doc, updateDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useFirestore } from 'reactfire';
import useRequestState from '~/core/hooks/use-request-state';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

import type { Task } from '../types/task';

function useUpdateTask() {
  const firestore = useFirestore();
  const { setData, state, setError, setLoading } = useRequestState();

  const updateTaskCallback = useCallback(
    async (task: Task) => {
      setLoading(true);
      try {
        const docRef = doc(
          firestore,
          TASKS_COLLECTION,
          `/${task.id as string}`
        );
        const taskUpdate = {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
        };
        await updateDoc(docRef, taskUpdate);
        setData(taskUpdate);
      } catch (error) {
        setError((error as FirebaseError).message);
        console.error(error);
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
