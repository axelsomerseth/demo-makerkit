import { Trans } from 'react-i18next';
import AppContainer from '~/components/AppContainer';
import AppHeader from '~/components/AppHeader';
import TasksLayout from '~/components/tasks/TasksLayout';
import ClientOnly from '~/core/ui/ClientOnly';

function TasksPage() {
  return (
    <>
      <AppHeader>
        <Trans i18nKey={'common:tasksTabLabel'} />
      </AppHeader>

      <ClientOnly>
        <AppContainer>
          <TasksLayout />
        </AppContainer>
      </ClientOnly>
    </>
  );
}

export default TasksPage;
