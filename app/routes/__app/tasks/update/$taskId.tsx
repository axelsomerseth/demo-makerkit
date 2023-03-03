import UpdateTaskModal from '~/components/tasks/UpdateTaskModal';
import { useParams } from '@remix-run/react';
import ClientOnly from '~/core/ui/ClientOnly';
import AppContainer from '~/components/AppContainer';

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
      <ClientOnly>
        <AppContainer>
          <UpdateTaskModal taskId={params.taskId as string} />
        </AppContainer>
      </ClientOnly>
    </>
  );
}

export default EditTaskPage;
