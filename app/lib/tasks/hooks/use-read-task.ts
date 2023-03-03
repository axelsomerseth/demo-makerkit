import { doc } from 'firebase/firestore';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

import type { DocumentReference } from 'firebase/firestore';
import type { Task } from '../types/task';

function useReadTask(taskId: string) {
  const firestore = useFirestore();

  const docRef = doc(
    firestore,
    TASKS_COLLECTION,
    `/${taskId}`
  ) as DocumentReference<Task>;
  return useFirestoreDocData<Task>(docRef, {
    idField: 'id',
    initialData: undefined,
  });
}

export default useReadTask;
