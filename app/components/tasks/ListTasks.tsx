import { useContext } from 'react';
import { Timestamp } from 'firebase/firestore';
import If from '~/core/ui/If';
import useListTasks from '~/lib/tasks/hooks/use-list-tasks';
import OrganizationContext from '~/lib/contexts/organization';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';
import TaskCard from './TaskCard';

const ListTasks: React.FC<{}> = () => {
  const { organization } = useContext(OrganizationContext);
  const {
    data: tasks,
    error,
    status,
  } = useListTasks(organization?.id as string);

  return (
    <div className="grid grid-cols-1 gap-4">
      <If condition={status === 'loading'}>
        <PageLoadingIndicator />
      </If>
      <If condition={status === 'error'}>
        <span className="text-red-500">{error?.message}</span>
      </If>
      <If condition={status === 'success'}>
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
      </If>
    </div>
  );
};

export default ListTasks;
