import { Trans } from 'react-i18next';
import CreateTaskButton from './CreateTaskButton';
import TaskCard from './TaskCard';

const sampleData = [
  {
    id: 'akondajDHJSBD',
    name: 'Title 1',
    description: 'Description 1',
    organizationId: 'nvjikhanshjvabsdhv',
    dueDate: new Date(),
    isDone: false,
    createdAt: new Date(),
    createdBy: 'ansduijabnsdhjbdhabsd',
  },
];

const TasksLayout: React.FC<{}> = () => {
  return (
    <>
      <div className={'mt-5 mb-5 flex justify-center'}>
        <div className={'flex-initial'}>
          <CreateTaskButton>
            <Trans i18nKey={'task:createTaskSubmitLabel'} />
          </CreateTaskButton>
        </div>
      </div>
      <div className={'grid-cols grid gap-3'}>
        {sampleData.map((task) => {
          return (
            <TaskCard
              key={task.id}
              name={task.name}
              description={task.description}
              isDone={task.isDone}
              dueDate={task.dueDate}
              createdAt={task.createdAt}
              createdBy={task.createdBy}
            />
          );
        })}
      </div>
    </>
  );
};

export default TasksLayout;
