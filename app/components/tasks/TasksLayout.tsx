import CreateTaskButton from './CreateTaskButton';

const TasksLayout: React.FC<{}> = () => {
  return (
    <>
      <div className={'mt-5 mb-5 flex justify-center'}>
        <div className={'flex-initial'}>
          <CreateTaskButton>Create a Task</CreateTaskButton>
        </div>
      </div>
    </>
  );
};

export default TasksLayout;
