import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { Trans } from 'react-i18next';
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
      <Modal isOpen={isOpen} setIsOpen={onClose} heading={<Trans i18nKey={'task:createTaskModalHeading'} /> }>
        <h2>TODO: add the form</h2>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
