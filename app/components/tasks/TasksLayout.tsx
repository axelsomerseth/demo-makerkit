import { Trans } from 'react-i18next';
import CreateTaskButton from './CreateTaskButton';

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
    </>
  );
};

export default TasksLayout;
