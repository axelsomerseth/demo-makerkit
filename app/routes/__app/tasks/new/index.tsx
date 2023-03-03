import AppContainer from '~/components/AppContainer';
import CreateTaskModal from '~/components/tasks/CreateTaskModal';
import ClientOnly from '~/core/ui/ClientOnly';

function NewTaskPage() {
  return (
    <>
      <ClientOnly>
        <AppContainer>
          <CreateTaskModal />
        </AppContainer>
      </ClientOnly>
    </>
  );
}

export default NewTaskPage;
