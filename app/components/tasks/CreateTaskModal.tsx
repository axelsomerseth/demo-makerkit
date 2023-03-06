import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '~/core/ui/Modal';

const CreateTaskModal: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClose = (flag: boolean) => {
    navigate(-1);
    setIsOpen(flag);
  };

  return (
    <>
      <Modal
        heading={t<string>('task:createTaskModalHeading')}
        isOpen={isOpen}
        setIsOpen={onClose}
      >
        <p>TODO: create a form </p>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
