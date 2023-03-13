import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import Modal from '~/core/ui/Modal';
import CreateTaskForm from './CreateTaskForm';

const CreateTaskModal: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const onClose = (flag: boolean) => {
    navigate(-1);
    setIsOpen(flag);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        heading={<Trans i18nKey={'task:createTaskModalHeading'} />}
      >
        <CreateTaskForm />
      </Modal>
    </>
  );
};

export default CreateTaskModal;
