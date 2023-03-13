import Button from '~/core/ui/Button';

const CreateTaskButton: React.FC<{}> = () => {
  const onClick = () => {
    console.log('TODO: redirect to create task route');
  };

  return (
    <>
      <Button onClick={onClick}>Add Task</Button>
    </>
  );
};

export default CreateTaskButton;
