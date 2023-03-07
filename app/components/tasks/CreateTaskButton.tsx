import { Trans } from 'react-i18next';
import Button from '~/core/ui/Button';

const CreateTaskButton: React.FC<{}> = () => {
  return (
    <Button href="/tasks/new">
      <Trans i18nKey={'task:createTaskButtonLabel'} />
    </Button>
  );
};

export default CreateTaskButton;
