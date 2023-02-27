import { useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Modal from '~/core/ui/Modal';
import CreateTaskForm from './CreateTaskForm';

const CreateTaskModal: React.FCC<{}> = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigation = useNavigate();
  const { t } = useTranslation();

  const onClose = (flag: boolean) => {
    navigation(-1);
    setIsOpen(flag);
  };

  return (
    <>
      <Modal heading={t<string>('task:createTaskModalHeading')} isOpen={isOpen} setIsOpen={onClose}>
        <CreateTaskForm />
      </Modal>
    </>
  );
};

export default CreateTaskModal;
