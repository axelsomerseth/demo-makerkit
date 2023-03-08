import { useParams } from '@remix-run/react';
import UpdateTaskModal from '~/components/tasks/UpdateTaskModal';

function TaskUpdatePage() {
  const params = useParams();

  return (
    <>
      <UpdateTaskModal taskId={params.taskId as string} />
    </>
  );
}

export default TaskUpdatePage;
