import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '~/core/ui/Modal';
import CreateTaskForm from './CreateTaskForm';

const CreateTaskModal: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClose = (flag: boolean) => {
    navigate(-1);
    setIsOpen(flag);
  };

  return (
    <Modal
      heading={t<string>('task:createTaskModalHeading')}
      isOpen={isOpen}
      setIsOpen={onClose}
    >
      <CreateTaskForm />
    </Modal>
  );
};

export default CreateTaskModal;
