import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '~/core/ui/Modal';
import If from '~/core/ui/If';
import PageLoadingIndicator from '~/core/ui/PageLoadingIndicator';
import UpdateTaskForm from './UpdateTaskForm';
import useFetchTask from '~/lib/tasks/hooks/use-fetch-task';

const UpdateTaskModal: React.FCC<{ taskId: string }> = ({ taskId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: actualTask, error, status } = useFetchTask(taskId);

  const onClose = (flag: boolean) => {
    navigate(-1);
    setIsOpen(flag);
  };

  return (
    <Modal
      heading={t<string>('task:updateTaskModalHeading')}
      isOpen={isOpen}
      setIsOpen={onClose}
    >
      <If condition={status === 'loading'}>
        <PageLoadingIndicator />
      </If>
      <If condition={status === 'error'}>
        <p className="bg-danger-500">{error?.message}</p>
      </If>
      <If condition={status === 'success'}>
        <UpdateTaskForm task={actualTask} />
      </If>
    </Modal>
  );
};

export default UpdateTaskModal;
