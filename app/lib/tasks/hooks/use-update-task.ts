import useRequestState from '~/core/hooks/use-request-state';

import type { Timestamp } from 'firebase/firestore';
import { useCallback } from 'react';

function useUpdateTask() {
  const { state } = useRequestState();
  // TODO: write down the steps you will follow to update a task.

  const updateTask = useCallback(
    async (name: string, description: string, dueDate: Timestamp) => {
      console.log(`Using useUpdateTask:`, name, description, dueDate);
    },
    []
  );

  return [updateTask, state] as [typeof updateTask, typeof state];
}

export default useUpdateTask;
