import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import IconButton from '~/core/ui/IconButton';
import useDeleteTask from '~/lib/tasks/hooks/use-delete-task';

import type { Task } from '../../lib/tasks/types/task';

const DeleteTaskButton: React.FC<{ task: Task }> = ({ task }) => {
  const [deleteTask, requestState] = useDeleteTask();
  const { t } = useTranslation();

  const onClick = () => {
    console.log(task.id);
    const promise = deleteTask(task);

    toast.promise(promise, {
      loading: t<string>('task:deletedTaskLoading'),
      success: t<string>('task:deletedTaskSuccess'),
      error: t<string>('task:deletedTaskError'),
    });
  };

  return (
    <IconButton onClick={onClick} loading={requestState.loading}>
      <TrashIcon className={'h-6'} />
    </IconButton>
  );
};

export default DeleteTaskButton;
