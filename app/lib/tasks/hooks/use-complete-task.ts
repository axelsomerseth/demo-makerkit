import { useCallback } from 'react';
import { useFirestore } from 'reactfire';
import { FirebaseError } from 'firebase/app';
import { doc, updateDoc } from 'firebase/firestore';
import useRequestState from '~/core/hooks/use-request-state';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';
import { Task } from '../types/task';

function useCompleteTask() {
  const { setData, setError, setLoading, state } = useRequestState();
  const firestore = useFirestore();

  const completeTaskCallback = useCallback(
    async (task: Task) => {
      setLoading(true);
      try {
        const completeTaskDoc = doc(firestore, TASKS_COLLECTION, `/${task.id}`);
        await updateDoc(completeTaskDoc, {done: !task.done});
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
