import Button from '~/core/ui/Button';

const CreateTaskButton: React.FCC<{}> = (props) => {
  return (
    <>
      <Button href={'/tasks/new'}>{props.children}</Button>
    </>
  );
};

export default CreateTaskButton;
