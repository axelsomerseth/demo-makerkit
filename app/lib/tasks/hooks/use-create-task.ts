import {
  collection,
  getFirestore,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { useCallback } from 'react';
import useRequestState from '~/core/hooks/use-request-state';
import { useUser } from 'reactfire';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

import type { FirebaseError } from 'firebase-admin';
import type { CollectionReference } from 'firebase/firestore';
import type { Task } from '../types/task';

function useCreateTask() {
  const { data: user } = useUser();
  const { state, setData, setLoading, setError } = useRequestState();

  const createTaskCallback = useCallback(
    async (
      name: string,
      description: string,
      organizationId: string,
      dueDate: Timestamp,
      isDone: boolean
    ) => {
      setLoading(true);

      try {
        const firestore = getFirestore();

        const tasksCollection = collection(
          firestore,
          TASKS_COLLECTION
        ) as CollectionReference<Task>;

        const newTask: Task = {
          name,
          description,
          organizationId,
          dueDate,
          isDone,
          createdAt: Timestamp.now(),
          createdBy: user?.uid as string,
        };

        const taskDoc = await addDoc(tasksCollection, newTask);

        setData({
          id: taskDoc.id,
          name: newTask.name,
          description: newTask.description,
          organizationId: newTask.organizationId,
          dueDate: newTask.dueDate,
          isDone: newTask.isDone,
          createdAt: newTask.createdAt,
          createdBy: newTask.createdBy,
        });
      } catch (error) {
        setError((error as FirebaseError).message);
      }
    },
    [setData, setLoading, setError, user?.uid]
  );

  return [createTaskCallback, state] as [
    typeof createTaskCallback,
    typeof state
  ];
}

export default useCreateTask;
