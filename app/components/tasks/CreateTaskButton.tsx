import { useNavigate } from '@remix-run/react';
import Button from '~/core/ui/Button';

const CreateTaskButton: React.FC<{}> = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/tasks/new');
  };

  return (
    <>
      <Button onClick={onClick}>Add Task</Button>
    </>
  );
};

export default CreateTaskButton;
