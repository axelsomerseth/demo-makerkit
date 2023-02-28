import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

import type { CollectionReference } from 'firebase/firestore';
import type { Task } from '../types/task';

function useListTasks(organizationId: string) {
  const firestore = useFirestore();

  const tasksCollection = collection(firestore, TASKS_COLLECTION);

  const listQuery = query(
    tasksCollection,
    where('organizationId', '==', organizationId)
  ) as CollectionReference<Task>;

  return useFirestoreCollectionData(listQuery, {
    idField: 'id',
    initialData: [],
  });
}
export default useListTasks;
