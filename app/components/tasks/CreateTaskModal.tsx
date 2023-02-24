import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import Modal from '~/core/ui/Modal';

const CreateTaskModal: React.FCC<{}> = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigation = useNavigate();

  const onClose = (flag: boolean) => {
    navigation(-1);
    setIsOpen(flag);
  };

  return (
    <>
      <Modal heading={'Create Task'} isOpen={isOpen} setIsOpen={onClose}>
        <h2>Modal content</h2>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
