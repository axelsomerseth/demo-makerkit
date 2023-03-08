import { PencilIcon } from '@heroicons/react/24/outline';
import { useNavigate } from '@remix-run/react';
import IconButton from '~/core/ui/IconButton';

import type { Task } from '~/lib/tasks/types/task';

const UpdateTaskButton: React.FCC<{ task: Task }> = ({ task }) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/tasks/${task.id as string}/edit`);
  };

  return (
    <>
      <IconButton onClick={onClick}>
        <PencilIcon className={'h-6'} />
      </IconButton>
    </>
  );
};

export default UpdateTaskButton;
