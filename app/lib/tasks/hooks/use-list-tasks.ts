import { collection, orderBy, query, where } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

import type { CollectionReference } from 'firebase/firestore';
import type { Task } from '../types/task';

function useListTasks(organizationId: string) {
  const firestore = useFirestore();

  const tasksCollection = collection(
    firestore,
    TASKS_COLLECTION
  ) as CollectionReference<Task>;

  const q = query(
    tasksCollection,
    where('organizationId', '==', organizationId),
    orderBy('createdAt', 'desc')
  );

  return useFirestoreCollectionData(q, { initialData: [], idField: 'id' });
}

export default useListTasks;
