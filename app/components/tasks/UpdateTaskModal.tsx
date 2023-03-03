import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '~/core/ui/Modal';
import UpdateTaskForm from './UpdateTaskForm';

const UpdateTaskModal: React.FCC<{ taskId: string }> = ({ taskId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  const navigation = useNavigate();

  const onClose = (flag: boolean) => {
    navigation(-1);
    setIsOpen(flag);
  };

  return (
    <Modal
      heading={t<string>('task:updateTaskModalHeading')}
      isOpen={isOpen}
      setIsOpen={onClose}
    >
      <UpdateTaskForm taskId={taskId} />
    </Modal>
  );
};

export default UpdateTaskModal;
