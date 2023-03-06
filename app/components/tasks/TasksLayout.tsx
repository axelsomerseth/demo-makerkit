import CreateTaskButton from "./CreateTaskButton";

const TasksLayout: React.FC<{}> = () => {
  return <>
  <div className="flex flex-col items-center space-y-5">
    <div className="flex-initial">     
      <CreateTaskButton></CreateTaskButton>
    </div>
    <div className="flex-initial">
      <h2>To do a list tasks here</h2>
    </div>
  </div>

  </>;
};

export default TasksLayout;
