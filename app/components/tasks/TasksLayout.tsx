import CreateTaskButton from './CreateTaskButton';
import ListTasks from './ListTasks';

const TasksLayout: React.FC<{}> = () => {
  return (
    <div className="flex flex-col items-center space-y-5 space-x-5">
      <div className="flex-initial">
        <CreateTaskButton></CreateTaskButton>
      </div>
      <div className="w-full flex-initial">
        <ListTasks></ListTasks>
      </div>
    </div>
  );
};

export default TasksLayout;
