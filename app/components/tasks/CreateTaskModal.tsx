import { useState } from 'react';
import Modal from '~/core/ui/Modal';

const CreateTaskModal: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading={'Add Task'}>
        <h2>TODO: add the form</h2>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
