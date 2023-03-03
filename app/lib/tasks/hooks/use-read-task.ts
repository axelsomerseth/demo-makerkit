import { doc } from 'firebase/firestore';
import { useCallback } from 'react';
import { useFirestore, useFirestoreDocDataOnce } from 'reactfire';
import { TASKS_COLLECTION } from '~/lib/firestore-collections';

function useReadTask(taskId: string) {
  const firestore = useFirestore();

  const docRef = doc(firestore, TASKS_COLLECTION, `/${taskId}`);
  return useFirestoreDocDataOnce(docRef, {
    idField: 'id',
    initialData: undefined,
  });
}

export default useReadTask;
