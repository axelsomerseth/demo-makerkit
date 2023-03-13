import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import Modal from '~/core/ui/Modal';

const CreateTaskModal: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const onClose = (flag: boolean) => {
    navigate(-1);
    setIsOpen(flag);
  };

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={onClose} heading={'Add Task'}>
        <h2>TODO: add the form</h2>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
