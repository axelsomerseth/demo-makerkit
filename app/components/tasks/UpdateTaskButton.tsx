import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { useNavigate } from '@remix-run/react';
import IconButton from '~/core/ui/IconButton';
import type { Task } from '../../lib/tasks/types/task';

const UpdateTaskButton: React.FCC<{ task: Task }> = ({ task }) => {
  const navigation = useNavigate();

  const onClick = () => {
    navigation(`/tasks/update/${task.id as string}`);
  };

  return (
    <IconButton onClick={onClick}>
      <PencilIcon className="h-6" />
    </IconButton>
  );
};

export default UpdateTaskButton;
