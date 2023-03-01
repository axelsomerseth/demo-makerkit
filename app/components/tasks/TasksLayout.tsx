import { Trans } from 'react-i18next';
import useListTasks from '~/lib/tasks/hooks/use-list-tasks';
import CreateTaskButton from './CreateTaskButton';
import TaskCard from './TaskCard';
import { useContext } from 'react';
import OrganizationContext from '~/lib/contexts/organization';
import If from '~/core/ui/If';
import SubHeading from '~/core/ui/SubHeading';

const TasksLayout: React.FC<{}> = () => {
  const { organization } = useContext(OrganizationContext);
  const {
    data: tasks,
    error,
    status,
  } = useListTasks(organization?.id as string);

  return (
    <>
      <div className={'mt-5 mb-5 flex justify-center'}>
        <div className={'flex-initial'}>
          <CreateTaskButton>
            <Trans i18nKey={'task:createTaskSubmitLabel'} />
          </CreateTaskButton>
        </div>
      </div>
      <If condition={status === 'loading'}>
        <div className={'flex justify-center'}>
          <div className={'flex-initial'}>
            <SubHeading>
              <Trans i18nKey={'task:loadingList'} />
            </SubHeading>
          </div>
        </div>
      </If>
      <If condition={status === 'success'}>
        <div className={'grid-cols grid gap-3'}>
          {tasks.map((task) => {
            return <TaskCard key={task.id} task={task} />;
          })}
        </div>
      </If>
      <If condition={status === 'error'}>
        <div className={'flex justify-center'}>
          <div className={'flex-initial'}>
            <SubHeading>{error?.message}</SubHeading>
          </div>
        </div>
      </If>
    </>
  );
};

export default TasksLayout;
