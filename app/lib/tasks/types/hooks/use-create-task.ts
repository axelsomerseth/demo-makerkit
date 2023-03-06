import { FirebaseError } from 'firebase/app';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useCallback } from 'react';
import { useFirestore, useUser } from 'reactfire';
import useRequestState from '~/core/hooks/use-request-state';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';
import { Task } from '../task';

function useCreateTask() {
  const firestore = useFirestore();
  const { data: user } = useUser();
  const { setData, setError, setLoading, state } = useRequestState();

  const createTaskCallback = useCallback(
    async (
      title: string,
      description: string,
      dueDate: Date,
      done: boolean,
      organizationId: string
    ) => {
      setLoading(true);
      try {
        const tasksCollectionRef = collection(firestore, TASKS_COLLECTION);
        const newTask: Task = {
          title,
          description,
          organizationId,
          dueDate: Timestamp.fromDate(dueDate),
          done,
          createdAt: Timestamp.now(),
          createdBy: user?.uid as string,
        };
        const docRef = await addDoc(tasksCollectionRef, newTask);

        setData({
          id: docRef.id,
          ...newTask,
        });
      } catch (error) {
        setError((error as FirebaseError).message);
        console.error(error);
      }
    },
    [setData, setError, setLoading]
  );

  return [createTaskCallback, state] as [typeof createTaskCallback, typeof state];
}

export default useCreateTask;
