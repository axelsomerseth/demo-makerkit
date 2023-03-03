import UpdateTaskModal from '~/components/tasks/UpdateTaskModal';
import { useParams } from '@remix-run/react';

function EditTaskPage() {
  const params = useParams();

  if (!params.taskId) {
    return (
      <>
        <h4>Not Found</h4>
      </>
    );
  }

  return (
    <>
      <UpdateTaskModal taskId={params.taskId as string} />
    </>
  );
}

export default EditTaskPage;
