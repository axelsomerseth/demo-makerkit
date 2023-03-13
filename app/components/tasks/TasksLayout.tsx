import CreateTaskButton from './CreateTaskButton';
import ListTasks from './ListTasks';

const TasksLayout: React.FC<{}> = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex-initial">
        <CreateTaskButton />
      </div>
      <div className="flex-initial">
        <ListTasks />
      </div>
    </div>
  );
};

export default TasksLayout;
