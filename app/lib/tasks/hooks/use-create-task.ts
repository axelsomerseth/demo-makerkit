import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useCallback } from 'react';
import { useFirestore, useUser } from 'reactfire';
import useRequestState from '~/core/hooks/use-request-state';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

import type { CollectionReference, WithFieldValue } from 'firebase/firestore';
import type { FirebaseError } from 'firebase/app';
import type { Task } from '../types/task';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

/**
 * @name useCreateTask
 * @description Hook to create a new task
 * @returns {Array} - A callback and a finite-state machine for the request
 */
function useCreateTask() {
  const firestore = useFirestore();
  const { setLoading, setData, setError, state } = useRequestState();
  const organization = useCurrentOrganization();
  const { data: user } = useUser();

  const createTaskCallback = useCallback(
    async (task: Task) => {
      setLoading(true);
      try {
        const tasksCollection = collection(
          firestore,
          TASKS_COLLECTION
        ) as CollectionReference<Task>;
        const newTask: WithFieldValue<Task> = {
          ...task,
          organizationId: organization?.id as string,
          createdAt: Timestamp.now(),
          createdBy: user?.uid as string,
        };
        const docRef = await addDoc(tasksCollection, newTask);
        setData({
          ...docRef,
        });
      } catch (error) {
        setError((error as FirebaseError).message);
        console.error(error);
      }
    },
    [setLoading, setData, setError, firestore, organization?.id, user?.uid]
  );

  return [createTaskCallback, state] as [
    typeof createTaskCallback,
    typeof state
  ];
}

export default useCreateTask;
