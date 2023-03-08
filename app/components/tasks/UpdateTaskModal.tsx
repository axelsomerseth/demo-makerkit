import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '~/core/ui/Modal';

const UpdateTaskModal: React.FCC<{ taskId: string }> = ({ taskId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  console.log(taskId);

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
      <h2>TODO: render update task form here</h2>
    </Modal>
  );
};

export default UpdateTaskModal;
