import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

function useListTasks(organizationId: string) {
  const firestore = useFirestore();

  const tasksCollection = collection(firestore, TASKS_COLLECTION);

  const listQuery = query(
    tasksCollection,
    where('organizationId', '==', organizationId)
  );

  return useFirestoreCollectionData(listQuery, {
    idField: 'id',
    initialData: [],
  });
}
export default useListTasks;
