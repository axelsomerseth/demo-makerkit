import { doc, updateDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useFirestore } from 'reactfire';
import useRequestState from '~/core/hooks/use-request-state';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

import type { Task } from '../types/task';
import type { FirebaseError } from 'firebase/app';

/**
 * @name useCompleteTask
 * @description Hook to mark as completed a task
 */
function useCompleteTask() {
  const { state, setData, setError, setLoading } = useRequestState();

  const firestore = useFirestore();
  const completeTaskCallback = useCallback(
    async (task: Task) => {
      setLoading(true);
      try {
        const taskDoc = doc(
          firestore,
          TASKS_COLLECTION,
          `/${task.id as string}`
        );
        await updateDoc(taskDoc, { isDone: !task.isDone });
        setData(task);
      } catch (error) {
        setError((error as FirebaseError).message);
        console.error(error);
      }
    },
    [setData, setError, setLoading, firestore]
  );

  return [completeTaskCallback, state] as [
    typeof completeTaskCallback,
    typeof state
  ];
}
export default useCompleteTask;
